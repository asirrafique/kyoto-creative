const fs = require('fs');
const js = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const p = js.indexOf('"$!"===a.data');
console.log('Found at:', p);
const slice = js.substring(p - 3, p + 130);
console.log('Target string is:\n', slice);
