const fs = require('fs');

function search(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = dir + '/' + item;
    if (item === 'node_modules' || item === '.next' || item === '.git' || item.endsWith('.png') || item.endsWith('.jpg')) continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      search(full);
    } else if (stat.isFile()) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('More Than a Website') || content.includes('More than a Website') || content.includes('More than a website')) {
        console.log('Found in:', full);
      }
    }
  }
}

search('.');
