const fs = require('fs');

const path = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js';
let content = fs.readFileSync(path, 'utf8');

const target = 'if(!o)throw Error(i(147,a));return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===a?t.ref:(l._stringRef=a,l)}(e,t,r,l):l,n.ref=e}';
console.log('Target found:', content.includes(target));

if (content.includes(target)) {
  const replacement = 'if(!o)return l;return null!==t&&null!==t.ref&&"function"==typeof t.ref&&t.ref._stringRef===a?t.ref:(l._stringRef=a,l)}(e,t,r,l):l;if(n)n.ref=e;}';
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully patched n0 null check!');
}
