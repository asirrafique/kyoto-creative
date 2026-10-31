const fs = require('fs');
const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const target = "text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');";
console.log('loc count of target:', loc.split(target).length - 1);
