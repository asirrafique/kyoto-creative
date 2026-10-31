const fs = require('fs');

const f = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');

// Find all <h1>, <h2> or project titles in 88pilot
const h1 = f.match(/<h1[^>]*>(.*?)<\/h1>/);
console.log('h1:', h1 ? h1[1] : null);

// Search for 88pilot in 88pilot_project_page.html
let pos = 0;
while ((pos = f.indexOf('88pilot', pos)) !== -1) {
  console.log('88pilot at', pos, ':', f.slice(Math.max(0, pos - 50), pos + 100));
  pos += 7;
}
