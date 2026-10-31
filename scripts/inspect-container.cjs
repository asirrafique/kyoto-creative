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
const hex = lastPayload.match(/^25:T([a-f\d]+),/)[1];
const len = parseInt(hex, 16);
const afterText = lastPayload.slice(lastPayload.indexOf(',') + 1 + len);
const rowEJson = afterText.slice(2);
const parsed = JSON.parse(rowEJson);

const container = parsed[2][3].children[1][3].children;
console.log('container structure:', JSON.stringify(container).slice(0, 500));
