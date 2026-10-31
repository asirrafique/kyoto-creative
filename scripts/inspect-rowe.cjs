const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
let m;
let pushes = [];
while ((m = re.exec(html)) !== null) {
  pushes.push(JSON.parse('"' + m[1] + '"'));
}
const flightText = pushes.join('');

const rowELine = flightText.split('\n').find(l => l.startsWith('e:'));
console.log('Row e length:', rowELine.length);
const rowEData = JSON.parse(rowELine.slice(2));
console.log('Row e data structure length (elements):', rowEData.length);
console.log('Row e element types:', rowEData.map(x => Array.isArray(x) ? x[0] : typeof x));

// Look inside rowEData for BAILOUT or projects
const str = JSON.stringify(rowEData);
console.log('rowE has BAILOUT?', str.includes('BAILOUT'));
console.log('rowE has projects?', str.includes('projects'));
console.log('rowE has seas-geosciences?', str.includes('seas-geosciences'));
console.log('rowE has Seven Gate?', str.includes('Seven Gate'));
