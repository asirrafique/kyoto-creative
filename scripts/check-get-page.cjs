const fs = require('fs');

const f = fs.readFileSync('src/lib/reference.js', 'utf8');

// Find getPage
const idx = f.indexOf('getPage');
console.log(f.slice(idx, idx + 800));
