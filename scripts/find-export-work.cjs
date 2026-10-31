const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// Find all occurrences of 60119 or 78267 in chunk
const idx = chunk.indexOf('60119');
console.log('60119 in chunk:', idx);
