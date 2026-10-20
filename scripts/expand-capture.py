"""Fill sitemap and link-graph gaps; cache redirects and query variants separately."""
import concurrent.futures
import hashlib
import html
import json
import pathlib
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

root = pathlib.Path(__file__).resolve().parent.parent
routes = json.loads((root / 'reference/routes.json').read_text())
assets = json.loads((root / 'reference/assets.json').read_text())
aliases = {}
errors = {}
new_routes = {}
assets_needed = set()
variants = {}

def get(url, headers=None):
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', **(headers or {})})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read(), response.headers.get('Content-Type', ''), response.url

def key_for(url):
    u = urllib.parse.urlsplit(url)
    route = u.path.rstrip('/') or '/'
    params = urllib.parse.parse_qsl(u.query, keep_blank_values=True)
    params = sorted((k, v) for k, v in params if k != '_rsc' and not k.startswith('utm_'))
    return route + ('?' + urllib.parse.urlencode(params) if params else '')

def extract_links(text, route):
    links = set()
    for raw in re.findall(r'<a[^>]+href="([^"]+)"', text):
        url = urllib.parse.urljoin('https://kota.co.uk' + route, html.unescape(raw))
        u = urllib.parse.urlsplit(url)
        if u.netloc == 'kota.co.uk' and not re.search(r'\.[a-zA-Z0-9]{2,6}$', u.path):
            links.add(key_for(url))
    return links

def capture(key):
    url = 'https://kota.co.uk' + key
    try:
        body, kind, final = get(url)
        if 'text/html' not in kind:
            return set()
        canonical = key_for(final)
        if canonical != key:
            aliases[key] = canonical
        filename = hashlib.sha256(canonical.encode()).hexdigest() + '.html'
        (root / 'reference/pages' / filename).write_bytes(body)
        text = body.decode('utf-8')
        flight_url = 'https://kota.co.uk' + canonical + ('&' if '?' in canonical else '?') + '_rsc=replica'
        flight, flight_kind, _ = get(flight_url, {'RSC': '1'})
        if 'text/x-component' not in flight_kind:
            raise ValueError('Expected React Flight, received ' + flight_kind)
        (root / 'reference/pages' / filename.replace('.html', '.rsc')).write_bytes(flight)
        (variants if '?' in canonical else new_routes)[canonical] = filename
        assets_needed.update('https://kota.co.uk' + p for p in re.findall(r'(?:src|href)="(/_next/static/[^"?]+\.(?:js|css))', text))
        return extract_links(text, canonical)
    except Exception as error:
        errors[key] = str(error)
        return set()

seeds = set()
sitemap, _, _ = get('https://kota.co.uk/sitemap-0.xml')
sitemap_urls = [element.text for element in ET.fromstring(sitemap).iter() if element.tag.endswith('}loc')]
(root / 'reports/sitemap-urls.json').write_text(json.dumps(sitemap_urls, indent=2))
for url in sitemap_urls:
    if not re.search(r'\.[a-zA-Z0-9]{2,6}$', urllib.parse.urlsplit(url).path):
        seeds.add(key_for(url))
for route, filename in routes.items():
    seeds.update(extract_links((root / 'reference/pages' / filename).read_text(encoding='utf-8'), route))
seen = set(routes)
for depth in range(3):
    batch = sorted(seeds - seen)
    if not batch:
        break
    seen.update(batch)
    print('Discovery pass', depth + 1, ':', len(batch), 'new destinations', flush=True)
    seeds = set()
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        for links in pool.map(capture, batch):
            seeds.update(links)
    print('Captured', len(new_routes), 'pages;', len(variants), 'query variants;', len(aliases), 'redirects', flush=True)

def cache_asset(url):
    if url in assets:
        return
    try:
        body, _, _ = get(url)
        filename = 'reference/assets/' + hashlib.sha256(url.encode()).hexdigest() + pathlib.PurePosixPath(url).suffix
        (root / filename).write_bytes(body)
        assets[url] = filename
    except Exception as error:
        errors[url] = str(error)

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    list(pool.map(cache_asset, assets_needed))
routes.update(new_routes)
# Repair obsolete relative links to their current service/sector destinations.
for route in errors:
    target = None
    if route.startswith('/service/') and route.count('/') > 2:
        candidate = '/service/' + route.rsplit('/', 1)[-1]
        target = candidate if candidate in routes else aliases.get(candidate)
    elif route.startswith('/landing-page/'):
        candidate = '/' + route.rsplit('/', 1)[-1]
        if candidate in routes:
            target = candidate
    if target:
        aliases[route] = target
aliases['/service/branding/visual-identity'] = '/service/brand-identity-design'
for name, value in [('routes.json', routes), ('assets.json', assets), ('redirects.json', aliases), ('variants.json', variants)]:
    (root / 'reference' / name).write_text(json.dumps(value, indent=2), encoding='utf-8')
(root / 'reports/expanded-capture.json').write_text(json.dumps({'totalPages': len(routes), 'newPages': len(new_routes), 'queryVariants': len(variants), 'redirects': aliases, 'unavailableOnOriginal': errors}, indent=2), encoding='utf-8')
print('Complete:', len(routes), 'pages,', len(variants), 'variants,', len(aliases), 'redirects,', len(errors), 'unavailable', flush=True)
