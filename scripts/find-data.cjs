const fs = require('fs');
const js = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const p = js.indexOf('"$!"===a.data');
console.log('p at', p);
console.log(js.substring(p - 100, p + 250));
