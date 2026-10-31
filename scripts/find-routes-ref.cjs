const fs = require('fs');

const f = fs.readFileSync('src/lib/reference.js', 'utf8');

// Search for routes.json
const idx = f.indexOf('routes.json');
console.log('routes.json in reference.js at:', idx);
console.log(f.slice(idx - 200, idx + 600));
