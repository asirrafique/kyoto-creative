const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('function tK(e){');
console.log('tK at:', idx);
if (idx !== -1) {
  console.log(chunk.slice(idx, idx + 300));
}
