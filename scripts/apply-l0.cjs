const fs = require('fs');
const filePath = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js';
let js = fs.readFileSync(filePath, 'utf8');

const target = 'if("$!"===a.data){if(a=a.nextSibling&&a.nextSibling.dataset)var s=a.dgst;return a=s,(r=Error(i(419))).digest=a,l0(e,t,u,a=lN(r,a,void 0))}';
const replacement = 'if("$!"===a.data){return l0(e,t,u,null)}';

console.log('Target found in file?', js.includes(target));
if (js.includes(target)) {
  js = js.replace(target, replacement);
  fs.writeFileSync(filePath, js, 'utf8');
  console.log('Successfully updated fd9d1056 on disk!');
}
