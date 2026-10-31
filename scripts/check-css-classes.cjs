const fs = require('fs');

const f = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

// Find all occurrences of ProjectCard_ or project in CSS
const cssFiles = [...f.matchAll(/href="(\/_next\/static\/css\/[^"]+)"/g)].map(m => m[1]);
console.log('CSS files:', cssFiles);

for (const c of cssFiles) {
  const filePath = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk' + c.split('?')[0];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('ProjectCard_') || content.includes('projectList')) {
      console.log('Found in CSS:', filePath);
      const matches = [...content.matchAll(/(\.[a-zA-Z0-9_-]*(?:project|small|large|projectList)[a-zA-Z0-9_-]*\s*\{[^}]+\})/g)];
      matches.slice(0, 10).forEach(m => console.log(m[1]));
    }
  }
}
