const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('case 27:return $(t),null===e&&tZ&&(');
console.log('Before case 27 (300 chars):');
console.log(chunk.slice(idx - 300, idx));
