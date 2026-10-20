"""Refresh the public capture, then consolidate it for the local Next.js host."""
import hashlib
import json
import pathlib
import shutil
import subprocess
import sys

root = pathlib.Path(__file__).resolve().parent.parent
route_file = root / 'reference/routes.json'
retained_routes = json.loads(route_file.read_text()) if route_file.exists() else {}
for script in ['acquire.py', 'refresh-pages.py', 'restore-runtime.py']:
    subprocess.run([sys.executable, '-X', 'utf8', str(root / 'scripts' / script)], cwd=root, check=True)

index_file = root / 'reference/assets.json'
assets = json.loads(index_file.read_text())
for url, filename in list(assets.items()):
    if filename.startswith('reference/assets/'):
        continue
    source = root / filename
    target = root / 'reference/assets' / (hashlib.sha256(url.encode()).hexdigest() + source.suffix)
    shutil.copyfile(source, target)
    assets[url] = target.relative_to(root).as_posix()
index_file.write_text(json.dumps(assets, indent=2))

route_file = root / 'reference/routes.json'
routes = json.loads(route_file.read_text())
errors = json.loads((root / 'reports/page-capture.json').read_text())['errors']
routes = {**retained_routes, **{key: value for key, value in routes.items() if key not in errors}}
route_file.write_text(json.dumps(routes, indent=2))
subprocess.run([sys.executable, '-X', 'utf8', str(root / 'scripts/expand-capture.py')], cwd=root, check=True)
subprocess.run([sys.executable, '-X', 'utf8', str(root / 'scripts/retry-capture.py')], cwd=root, check=True)
print('Reference ready:', len(routes), 'routes;', len(assets), 'indexed assets.')
