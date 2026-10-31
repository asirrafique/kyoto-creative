const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

// Look for template
let pos = 0;
while ((pos = chunk.indexOf('template', pos)) !== -1) {
  console.log('Found template at', pos, ':', chunk.slice(Math.max(0, pos - 50), pos + 100));
  pos += 8;
}
