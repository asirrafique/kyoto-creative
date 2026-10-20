import pathlib,json,hashlib,urllib.request,re,concurrent.futures
root=pathlib.Path(__file__).resolve().parent.parent;routes=json.loads((root/'reference/routes.json').read_text());assets=json.loads((root/'reference/assets.json').read_text());report=json.loads((root/'reports/expanded-capture.json').read_text());targets=[u for u,e in report['unavailableOnOriginal'].items() if 'timed out' in e]
def fetch(url,headers=None):
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0',**(headers or {})}),timeout=90) as r:return r.read()
def work(route):
 try:
  body=fetch('https://kota.co.uk'+route);flight=fetch('https://kota.co.uk'+route+'?_rsc=replica',{'RSC':'1'});name=hashlib.sha256(route.encode()).hexdigest()+'.html';(root/'reference/pages'/name).write_bytes(body);(root/'reference/pages'/name.replace('.html','.rsc')).write_bytes(flight);routes[route]=name
  for p in set(re.findall(r'(?:src|href)="(/_next/static/[^"?]+\.(?:js|css))',body.decode())):
   url='https://kota.co.uk'+p
   if url not in assets:
    target='reference/assets/'+hashlib.sha256(url.encode()).hexdigest()+pathlib.PurePosixPath(p).suffix;(root/target).write_bytes(fetch(url));assets[url]=target
  print('Recovered',route,flush=True)
 except Exception as e:print('Unavailable',route,str(e),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(work,targets))
(root/'reference/routes.json').write_text(json.dumps(routes,indent=2));(root/'reference/assets.json').write_text(json.dumps(assets,indent=2));p=root/'reference/redirects.json';d=json.loads(p.read_text());d['/service/branding/visual-identity']='/service/brand-identity-design';p.write_text(json.dumps(d,indent=2));print('Pages',len(routes))
