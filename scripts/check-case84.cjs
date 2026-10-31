const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', 'utf8');

const idx = f.indexOf('case 84:');
// Find where chunk parsing happens before this switch
console.log(f.slice(idx - 1500, idx - 600));
