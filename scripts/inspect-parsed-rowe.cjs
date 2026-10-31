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

// afterText starts with "e:[[["$","title"..."
const rowEJson = afterText.slice(2);
console.log('rowEJson length:', rowEJson.length);
let parsed;
try {
  parsed = JSON.parse(rowEJson);
  console.log('Successfully parsed row E as JSON!');
} catch (e) {
  console.log('Error parsing row E:', e.message);
  process.exit(1);
}

// Traverse parsed structure to find BAILOUT or projects
function search(node, path = '') {
  if (!node) return;
  if (typeof node === 'string') {
    if (node.includes('BAILOUT') || node.includes('Work_projectsWithFilters')) {
      console.log('Found string match at', path, ':', node.slice(0, 100));
    }
    return;
  }
  if (Array.isArray(node)) {
    if (node[0] === '$' && typeof node[1] === 'string' && node[1].startsWith('$L')) {
      console.log('Found component reference:', node[1], 'at', path, 'props:', Object.keys(node[3] || {}));
    }
    node.forEach((child, i) => search(child, `${path}[${i}]`));
  } else if (typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      search(v, `${path}.${k}`);
    }
  }
}

search(parsed);
