"""Cache reference pages and original dependencies without changing the HTTrack backup."""
import concurrent.futures, hashlib, json, pathlib, re, urllib.request, urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'reference/pages'
ASSETS = ROOT / 'reference/assets'
failures = {}
urls = {}

def download(url, target):
    if target.exists() and target.stat().st_size:
        return True
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=90) as response:
            body = response.read()
            if response.headers.get_content_type() == 'text/html' and target.suffix not in ['.html', '']:
                return False
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
        return True
    except Exception as e:
        failures[url] = str(e)
        return False

def asset_path(url):
    suffix = pathlib.PurePosixPath(urllib.parse.urlsplit(url).path).suffix or '.bin'
    return ASSETS / (hashlib.sha256(url.encode()).hexdigest() + suffix)

def discover(text, base):
    text = text.replace('\\/', '/').replace('\\"', '"')
    found = set()
    patterns = [r'(?:src|href|poster)=["\x27]([^"\x27]+)', r'url\(["\x27]?([^)"\x27\s]+)', r'["\x27]((?:https?://|/)[^"\x27<>\s]+\.(?:mp4|webm|svg|png|jpe?g|webp|woff2|glb|gltf|splinecode|wasm)(?:\?[^"\x27<>\s]*)?)["\x27]']
    for pattern in patterns:
        for raw in re.findall(pattern, text):
            url = urllib.parse.urljoin(base, raw.replace('&amp;', '&'))
            u = urllib.parse.urlsplit(url)
            if u.hostname in ['kota.co.uk', 'kota-content.b-cdn.net', 'content.kota.co.uk'] and (re.search(r'\.(js|css|mp4|webm|svg|png|jpe?g|webp|woff2|glb|gltf|splinecode|wasm)(?:\?|$)', url) or '/_next/image?' in url):
                found.add(url)
    return found

routes = {}
for p in (ROOT / 'intern/kota.co.uk').rglob('*.html'):
    s = p.read_text(encoding='utf-8', errors='replace')
    m = re.search(r'Mirrored from (https://kota.co.uk/[^\s]*) by HTTrack', s)
    if not m:
        m = re.search(r'<meta[^>]+property="og:url"[^>]+content="([^"]+)', s)
    if m:
        route = urllib.parse.urlsplit(m[1]).path.rstrip('/') or '/'
        if re.search(r'\.(?:js|css|wasm)$', route):
            continue
        routes.setdefault(route, p)
print('Discovered routes', len(routes), flush=True)
principal = ['/', '/work', '/agency', '/culture', '/contact', '/start-your-project', '/blog', '/faqs', '/service/brand-strategy-and-identity', '/service/web-design-development', '/service/growth-marketing']
index = {}

def save_page(route):
    target = PAGES / (hashlib.sha256(route.encode()).hexdigest() + '.html')
    if route in principal:
        download('https://kota.co.uk' + route, target)
    if not target.exists():
        target.write_text(routes[route].read_text(encoding='utf-8'), encoding='utf-8')
    index[route] = target.name
    return route, target

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    pages = list(pool.map(save_page, routes))
(ROOT / 'reference/routes.json').write_text(json.dumps(index, indent=2), encoding='utf-8')
for p in (ROOT / 'intern/kota.co.uk/_next/static').rglob('*'):
    if p.is_file():
        url = 'https://kota.co.uk/' + p.relative_to(ROOT / 'intern/kota.co.uk').as_posix()
        urls[url] = p.relative_to(ROOT).as_posix()
assets = set()
for route, p in pages:
    if route in principal:
        assets.update(discover(p.read_text(encoding='utf-8'), 'https://kota.co.uk' + route))
print('Principal dependencies', len(assets), flush=True)

def acquire(url):
    if url in urls:
        return url
    u = urllib.parse.urlsplit(url)
    mirror = ROOT / 'intern' / u.netloc / urllib.parse.unquote(u.path).lstrip('/')
    if mirror.is_file() and not u.query:
        urls[url] = mirror.relative_to(ROOT).as_posix()
        return url
    target = asset_path(url)
    if download(url, target):
        urls[url] = target.relative_to(ROOT).as_posix()
    return url

for depth in range(3):
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        list(pool.map(acquire, assets))
    extra = set()
    for url in assets:
        if url in urls and re.search(r'\.(?:js|css)$', url):
            extra.update(discover((ROOT / urls[url]).read_text(encoding='utf-8', errors='replace'), url))
    extra -= set(urls)
    extra -= set(failures)
    if not extra:
        break
    assets = extra
    print('Additional dependencies', len(extra), flush=True)
(ROOT / 'reference/assets.json').write_text(json.dumps(urls, indent=2), encoding='utf-8')
(ROOT / 'reports/acquisition.json').write_text(json.dumps({'routes': len(index), 'assets': len(urls), 'failures': failures}, indent=2), encoding='utf-8')
print('Complete', len(index), 'routes', len(urls), 'assets;', len(failures), 'failures', flush=True)
