const fs = require('fs');

const f = fs.readFileSync('src/lib/reference.js', 'utf8');

console.log('src/lib/reference.js length:', f.length);
console.log('First 600 chars:');
console.log(f.slice(0, 600));
