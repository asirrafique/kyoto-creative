const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// Replace 60119 with console.log on entry
const patched = chunk.replace(
  'function c(e){var t,r,l,c;let{projects:u}=e,',
  'function c(e){console.log("60119 ARCHIVE CALLED with props:", e);var t,r,l,c;let{projects:u}=e,'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', patched, 'utf8');
console.log('Patched chunk with log!');
