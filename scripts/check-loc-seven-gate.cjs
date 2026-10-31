const fs = require('fs');

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Find where Seven Gate Holdings is handled in localize.mjs
const idx = loc.indexOf('Seven Gate Holdings');
console.log('Seven Gate Holdings in localize.mjs:');
console.log(loc.slice(idx - 200, idx + 800));
