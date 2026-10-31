const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');
const rsc = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.rsc', 'utf8');

console.log('HTML length:', html.length, 'RSC length:', rsc.length);

const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
let m;
let pushes = [];
while ((m = re.exec(html)) !== null) {
  pushes.push(m[1]);
}
console.log('Pushes count in HTML:', pushes.length);

// Let's decode pushes and reconstruct flight data
let reconstructedFlight = pushes.map(p => JSON.parse('"' + p + '"')).join('');
console.log('Reconstructed flight length from HTML:', reconstructedFlight.length);
console.log('RSC file length:', rsc.length);

// Check difference between reconstructed flight and RSC file
console.log('Are reconstructedFlight and RSC identical?', reconstructedFlight === rsc);
if (reconstructedFlight !== rsc) {
  console.log('Diff at index:', findDiffIndex(reconstructedFlight, rsc));
}

function findDiffIndex(a, b) {
  let len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      return { index: i, aSub: a.substring(i, i+50), bSub: b.substring(i, i+50) };
    }
  }
  return { lenA: a.length, lenB: b.length };
}
