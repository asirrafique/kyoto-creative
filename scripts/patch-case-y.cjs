const fs = require('fs');

const path = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js';
let content = fs.readFileSync(path, 'utf8');

// Target the iz call in d:
// case y:return n=iz(t.type,t.key,t.props,null,e.mode,n),n0(e,null,n,t),n.return=e,n;
const target = 'case y:return n=iz(t.type,t.key,t.props,null,e.mode,n),n0(e,null,n,t),n.return=e,n;';
console.log('Target found:', content.includes(target));

if (content.includes(target)) {
  const replacement = 'case y:return (n=iz(t.type,t.key,t.props,null,e.mode,n))?(n0(e,null,n,t),n.return=e,n):null;';
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully guarded case y against null n!');
}
