import pathlib,json,hashlib,urllib.request,concurrent.futures
r=pathlib.Path('D:/intern');p=r/'reference/assets.json';index=json.loads(p.read_text())
def work(url):
 if '/_next/static/' not in url or not url.endswith(('.js','.css')): return
 target=r/'reference/assets'/(hashlib.sha256(url.encode()).hexdigest()+pathlib.Path(url).suffix)
 try:
  target.write_bytes(urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=45).read());index[url]=target.relative_to(r).as_posix()
 except Exception as e: print(url,str(e),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:list(pool.map(work,list(index)))
p.write_text(json.dumps(index,indent=2));print('Restored original runtime files')
