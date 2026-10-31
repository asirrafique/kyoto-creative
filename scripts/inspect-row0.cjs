const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
let m;
let pushes = [];
while ((m = re.exec(html)) !== null) {
  pushes.push(JSON.parse('"' + m[1] + '"'));
}
const flightText = pushes.join('');

const row0Line = flightText.split('\n').find(l => l.startsWith('0:'));
console.log('Row 0 length:', row0Line.length);
const row0Data = JSON.parse(row0Line.slice(2));
console.log('Row 0 data structure:', JSON.stringify(row0Data).slice(0, 500));
