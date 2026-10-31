const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
let m;
let pushes = [];
while ((m = re.exec(html)) !== null) {
  pushes.push(JSON.parse('"' + m[1] + '"'));
}

console.log('Total pushes:', pushes.length);
for (let i = 0; i < pushes.length; i++) {
  console.log(`Push ${i}: length ${pushes[i].length}, snippet:`, pushes[i].slice(0, 100).replace(/\n/g, '\\n'));
  if (pushes[i].includes('BAILOUT') || pushes[i].includes('projects') || pushes[i].includes('Work_projectsWithFilters')) {
    console.log(`Push ${i} has keywords!`);
  }
}
