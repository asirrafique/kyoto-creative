const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

const patched = chunk.replace(
  '48331:function(e,t,r){Promise.resolve().then(r.t.bind(r,31614,23)),',
  '48331:function(e,t,r){console.log("MODULE 48331 EXECUTING!");Promise.resolve().then(r.t.bind(r,31614,23)),'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', patched, 'utf8');
console.log('Patched 48331 with log!');
