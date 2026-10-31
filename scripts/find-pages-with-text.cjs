const fs = require('fs');

const files = fs.readdirSync('reference/pages');
for (const f of files) {
  if (f.endsWith('.html')) {
    const content = fs.readFileSync('reference/pages/' + f, 'utf8');
    if (content.includes('More Than a Website') || content.includes('More than a Website') || content.includes('Five strategic pillars')) {
      console.log('Found in:', f);
      console.log('Includes More Than a Website?', content.includes('More Than a Website') || content.includes('More than a Website'));
      console.log('Includes Five strategic?', content.includes('Five strategic pillars'));
    }
  }
}
