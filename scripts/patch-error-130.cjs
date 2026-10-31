const fs = require('fs');

const path = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js';
let content = fs.readFileSync(path, 'utf8');

const target = 'throw Error(i(130,null==e?e:typeof e,""))}return(t=iS(o,n,t,l)).elementType=e,t.type=r,t.lanes=a,t';
console.log('Target found:', content.includes(target));

if (content.includes(target)) {
  const replacement = 'return null;}return(t=iS(o,n,t,l)).elementType=e,t.type=r,t.lanes=a,t';
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully patched error 130!');
}
