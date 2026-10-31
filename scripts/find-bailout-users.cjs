const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', 'utf8');

// Find references to 18993 (BailoutToCSRError module)
let pos = 0;
while ((pos = chunk.indexOf('18993', pos)) !== -1) {
  console.log('Found 18993 at', pos, ':', chunk.slice(Math.max(0, pos - 100), pos + 200));
  pos += 5;
}
