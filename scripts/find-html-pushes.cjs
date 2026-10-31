const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

// Search for self.__next_f.push in html
const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs)];
console.log('Total __next_f pushes:', matches.length);

for (let i = 0; i < matches.length; i++) {
  const content = matches[i][1];
  if (content.includes('60119') || content.includes('Work_projectsWithFilters') || content.includes('BAILOUT')) {
    console.log(`Push ${i}:`, content.slice(0, 300));
  }
}
