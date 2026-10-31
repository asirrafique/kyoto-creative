const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find all occurrences of "The result" or "The strategy"
const resultIdx = f.indexOf('The result');
console.log('The result at:', resultIdx);
if (resultIdx !== -1) {
  console.log(f.slice(resultIdx, resultIdx + 600));
}
