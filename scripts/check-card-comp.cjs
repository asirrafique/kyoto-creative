const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// Find ProjectCard module 86258
const idx = chunk.indexOf('86258:');
console.log('86258 index:', idx);
if (idx !== -1) {
  console.log(chunk.slice(idx, idx + 1500));
}
