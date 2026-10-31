const fs = require('fs');

function searchDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = dir + '/' + item;
    if (item === 'node_modules' || item === '.next' || item === '.git' || item.endsWith('.png') || item.endsWith('.jpg')) continue;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchDir(full);
    } else if (stat.isFile() && (full.endsWith('.js') || full.endsWith('.mjs') || full.endsWith('.json') || full.endsWith('.cjs'))) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('88pilot') || content.includes('seven-gate') || content.includes('green-square')) {
        console.log('Found in:', full);
      }
    }
  }
}

searchDir('.');
