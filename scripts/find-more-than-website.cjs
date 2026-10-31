const fs = require('fs');

const f = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Find all occurrences of "More Than a Website" or "More than a website" in localize.mjs or repo
let pos = 0;
while ((pos = f.indexOf('More Than a Website', pos)) !== -1) {
  console.log('Found in localize.mjs at', pos, ':', f.slice(Math.max(0, pos - 100), pos + 200));
  pos += 15;
}
