const fs = require('fs');
const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');
console.log('loc includes targetStr?:', loc.includes('"title":"UPP","slug":"upp"'));
