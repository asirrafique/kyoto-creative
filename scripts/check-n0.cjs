const fs = require('fs');

const path = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js';
let content = fs.readFileSync(path, 'utf8');

// Check n0
const idx = 33264;
console.log('Snippet around 33264:');
console.log(content.slice(Math.max(0, idx - 100), Math.min(content.length, idx + 100)));
