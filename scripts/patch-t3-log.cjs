const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'function t3(e,t){return null!==(t=function(e,t,n,r){',
  'function t3(e,t){console.log("t3 matching DOM node:", e.nodeName, "against fiber:", t);return null!==(t=function(e,t,n,r){'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched t3 with log!');
