const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'if("$!"===a.data){return l0(e,t,u,null)}',
  'if("$!"===a.data){console.log("REACT ENCOUNTERED $! DEHYDRATED SUSPENSE", t);return l0(e,t,u,null)}'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched fd9d1056 with log!');
