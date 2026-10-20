"""Capture both documents and public React Flight responses for local navigation."""
import concurrent.futures, hashlib, json, pathlib, re, urllib.request

root = pathlib.Path(__file__).resolve().parent.parent
routes = json.loads((root / 'reference/routes.json').read_text())
assets = json.loads((root / 'reference/assets.json').read_text())
errors = {}

def get(url, headers=None):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', **(headers or {})})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read(), response.headers.get('Content-Type', '')

def capture(item):
    route, file = item
    try:
        html, _ = get('https://kota.co.uk' + route)
        (root / 'reference/pages' / file).write_bytes(html)
        flight, kind = get('https://kota.co.uk' + route + '?_rsc=replica', {'RSC': '1'})
        if 'text/x-component' in kind:
            (root / 'reference/pages' / file.replace('.html', '.rsc')).write_bytes(flight)
        else:
            errors[route] = 'Non-Flight response: ' + kind
    except Exception as e:
        errors[route] = str(e)

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    for i, _ in enumerate(pool.map(capture, routes.items())):
        if i % 30 == 0:
            print('Captured', i + 1, '/', len(routes), flush=True)

dependencies = set()
for file in routes.values():
    text = (root / 'reference/pages' / file).read_text(encoding='utf-8')
    dependencies.update('https://kota.co.uk' + x for x in re.findall(r'(?:src|href)="(/_next/static/[^"?]+\.(?:js|css))', text))

def cache(url):
    # Existing clean runtime files need no replacement.
    if assets.get(url, '').startswith('reference/assets/'):
        return
    try:
        body, _ = get(url)
        file = 'reference/assets/' + hashlib.sha256(url.encode()).hexdigest() + pathlib.PurePosixPath(url).suffix
        (root / file).write_bytes(body)
        assets[url] = file
    except Exception as e:
        errors[url] = str(e)

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    list(pool.map(cache, dependencies))
(root / 'reference/assets.json').write_text(json.dumps(assets, indent=2))
(root / 'reports/page-capture.json').write_text(json.dumps({'routes': len(routes), 'errors': errors}, indent=2))
print('Captured documents and navigation; errors:', len(errors), flush=True)
