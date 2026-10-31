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

const lastRow = rowIndices[rowIndices.length - 1];
const lastPayload = flightText.slice(lastRow.index);
console.log('Last row ID:', lastRow.id);
console.log('Last row prefix:', lastPayload.slice(0, 50));

// Row 25 is a Text row: 25:T730,{...}
// After 25:T730, let's see what follows!
const hex = lastPayload.match(/^25:T([a-f\d]+),/)[1];
const len = parseInt(hex, 16);
console.log('Text row length declared:', len);
const textContent = lastPayload.slice(lastPayload.indexOf(',') + 1, lastPayload.indexOf(',') + 1 + len);
console.log('Text content actual length:', textContent.length);

const afterText = lastPayload.slice(lastPayload.indexOf(',') + 1 + len);
console.log('Remaining after text row length:', afterText.length);
console.log('Remaining starts with:', afterText.slice(0, 100));
