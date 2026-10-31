const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'switch(t.tag){case 3:lq(t),at(t,ad,e.memoizedState.cache),nt();break;',
  'switch(t.tag){case 3:console.log("SWITCH TAG 3 (Root)", "tG was:", tG?.nodeName, tG?.className);lq(t),at(t,ad,e.memoizedState.cache),nt();break;'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched switch tag 3!');
