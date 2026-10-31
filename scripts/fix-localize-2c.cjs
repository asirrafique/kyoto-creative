const fs = require('fs');
let loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Replace 57|46|2c with 57|46
const target = 'text = text.replace(/,(?:\\\\{1,3}"\\$L(?:57|46|2c)\\\\{1,3}"|"\\$L(?:57|46|2c)")/g, \'\');';
const replacement = 'text = text.replace(/,(?:\\\\{1,3}"\\$L(?:57|46)\\\\{1,3}"|"\\$L(?:57|46)")/g, \'\');';

console.log('Target found:', loc.includes(target));
loc = loc.replace(target, replacement);
fs.writeFileSync('src/lib/localize.mjs', loc, 'utf8');
console.log('Successfully updated localize.mjs to not strip $L2c!');
