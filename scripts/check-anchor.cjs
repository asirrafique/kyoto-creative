const fs = require('fs');
const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');
console.log('loc includes targetAnchor?:', loc.includes("text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');"));
console.log('loc includes Bucher + Suter?:', loc.includes('Bucher + Suter'));
