const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

console.log('Chunk length:', chunk.length);

// Find 60119 and 78267 definitions in chunk
const idx60119 = chunk.indexOf('60119:');
console.log('60119 index:', idx60119);
if (idx60119 !== -1) {
  console.log('60119 preview:', chunk.slice(idx60119, idx60119 + 600));
}

const idx78267 = chunk.indexOf('78267:');
console.log('78267 index:', idx78267);
if (idx78267 !== -1) {
  console.log('78267 preview:', chunk.slice(idx78267, idx78267 + 600));
}
