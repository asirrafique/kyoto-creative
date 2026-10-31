const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');
const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs)];

for (let i = 0; i < matches.length; i++) {
  const content = matches[i][1];
  if (content.includes('2c:') || content.includes('2d:') || content.includes('2e:')) {
    console.log(`Push ${i} has definitions:`, content);
  }
}
