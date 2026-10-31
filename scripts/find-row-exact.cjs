const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
let m;
let pushes = [];
while ((m = re.exec(html)) !== null) {
  pushes.push(JSON.parse('"' + m[1] + '"'));
}
const flightText = pushes.join('');

const reRow = /(?:^|\n)([a-f\d]+):/g;
let rowIndices = [];
let match;
while ((match = reRow.exec(flightText)) !== null) {
  rowIndices.push({ id: match[1], index: match.index + (match[0].startsWith('\n') ? 1 : 0) });
}

console.log('Found rows:', rowIndices.length);
for (let i = 0; i < rowIndices.length; i++) {
  const current = rowIndices[i];
  const next = rowIndices[i + 1];
  const chunk = flightText.substring(current.index, next ? next.index : flightText.length);
  const colon = chunk.indexOf(':');
  const payload = chunk.slice(colon + 1);
  console.log(`Row id="${current.id}": payload len=${payload.length}, prefix=${payload.slice(0, 40).replace(/\n/g, '\\n')}`);
  if (current.id === 'e') {
    console.log('ROW E DETAILS: length =', payload.length);
    try {
      const parsed = JSON.parse(payload);
      console.log('Row e parses cleanly as JSON! Array length =', Array.isArray(parsed) ? parsed.length : 'not array');
    } catch (err) {
      console.log('Row e parse error:', err.message);
    }
  }
}
