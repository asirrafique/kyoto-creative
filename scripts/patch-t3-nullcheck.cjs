const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'function t3(e,t){console.log("t3 matching DOM node:", t.nodeName, "against fiber:", e.type);',
  'function t3(e,t){if(!t){console.log("t3 called with null DOM node for fiber:", e.type);return null}console.log("t3 matching DOM node:", t.nodeName, t.className, "against fiber:", e.type);'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched t3 with null check!');
