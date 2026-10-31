const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// Find size:"small" in chunk
let pos = 0;
while ((pos = chunk.indexOf('size:"small"', pos)) !== -1) {
  console.log('size:"small" at', pos, ':', chunk.slice(Math.max(0, pos - 50), pos + 100));
  pos += 12;
}

let pos2 = 0;
while ((pos2 = chunk.indexOf('size:w="small"', pos2)) !== -1) {
  console.log('size:w="small" at', pos2, ':', chunk.slice(Math.max(0, pos2 - 50), pos2 + 100));
  pos2 += 14;
}
