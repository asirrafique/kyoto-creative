const fs = require('fs');

const f = fs.readFileSync('reference/redirects.json', 'utf8');
console.log('redirects.json:');
console.log(f);
