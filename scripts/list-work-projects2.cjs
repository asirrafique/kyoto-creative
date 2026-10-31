const fs = require('fs');

const f = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

// Notice quotes are escaped in self.__next_f pushes!
const matches = [...f.matchAll(/\\"title\\":\\"([^"\\]+)\\",\\"slug\\":\\"([^"\\]+)\\"/g)];
console.log('Total projects in work page flight data (escaped):', matches.length);
matches.forEach((m, idx) => {
  console.log(`[${idx}] ${m[1]} (slug: ${m[2]})`);
});
