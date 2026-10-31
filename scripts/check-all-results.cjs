const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find all occurrences of "The result" in 0023
let pos = 0;
while ((pos = f.indexOf('The result', pos)) !== -1) {
  console.log('The result at', pos, ':', f.slice(pos, pos + 250));
  pos += 10;
}
