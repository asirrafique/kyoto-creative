const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', 'utf8');

// Find all occurrences of "case 84:"
const idxs = [...f.matchAll(/case 84:/g)].map(m => m.index);
console.log('case 84 occurrences at:', idxs);

// In RSC parser, parsing a line:
// usually something like `line.indexOf(":")` or `parseInt(..., 16)`
// Let's search for `case 73:` (I for Import / Client Reference)
const c73 = [...f.matchAll(/case 73:/g)].map(m => m.index);
console.log('case 73 occurrences at:', c73);
if (c73.length) {
  console.log(f.slice(c73[0] - 200, c73[0] + 300));
}
