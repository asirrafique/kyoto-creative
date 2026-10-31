const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', 'utf8');
const idx = chunk.indexOf('BAILOUT_TO_CLIENT_SIDE_RENDERING');
console.log('Index:', idx);
console.log(chunk.slice(Math.max(0, idx - 300), idx + 500));
