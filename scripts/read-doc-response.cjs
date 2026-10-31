const fs = require('fs');

const f = fs.readFileSync('src/lib/reference.js', 'utf8');

const idx = f.indexOf('export async function documentResponse');
console.log(f.slice(idx, idx + 1500));
