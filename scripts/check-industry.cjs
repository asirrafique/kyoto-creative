const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find all occurrences of "Industry"
let pos = 0;
while ((pos = f.indexOf('Industry', pos)) !== -1) {
  console.log('Industry at', pos, ':', f.slice(Math.max(0, pos - 50), pos + 250));
  pos += 8;
}
