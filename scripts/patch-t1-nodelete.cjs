const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'function t1(e,t){console.log("t1 DELETING DOM NODE during hydration:", t.nodeName, t.className || t.data);',
  'function t1(e,t){console.log("t1 PREVENTED DELETING DOM NODE:", t.nodeName);return;'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched t1 to not delete!');
