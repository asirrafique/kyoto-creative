const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'function lZ(e,t,n){var r,l=t.pendingProps,a=!1,o=0!=(128&t.flags);',
  'function lZ(e,t,n){console.log("lZ Suspense entry! tZ is:", tZ, "tG is:", tG?.nodeName, tG?.className, tG?.data);var r,l=t.pendingProps,a=!1,o=0!=(128&t.flags);'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched lZ log!');
