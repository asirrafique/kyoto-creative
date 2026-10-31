const fs = require('fs');

const f = fs.readFileSync('src/lib/reference.js', 'utf8');

// Find memoize definition
const idx = f.indexOf('function memoize');
console.log('function memoize:');
console.log(f.slice(idx, idx + 400));
