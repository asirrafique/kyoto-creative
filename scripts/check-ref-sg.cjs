const fs = require('fs');

const ref = fs.readFileSync('src/lib/reference.js', 'utf8');

// Find seven-gate-holdings in reference.js
let pos = 0;
while ((pos = ref.indexOf('seven-gate-holdings', pos)) !== -1) {
  console.log('seven-gate-holdings in reference.js at', pos, ':', ref.slice(Math.max(0, pos - 100), pos + 200));
  pos += 19;
}
