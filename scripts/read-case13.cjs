const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('case 13:return lZ(e,t,n);');
console.log('Around case 13:');
console.log(chunk.slice(idx - 100, idx + 400));
