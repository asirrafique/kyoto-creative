const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      searchDir(full);
    } else if (f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING')) {
        console.log('Found in:', full);
      }
    }
  }
}

searchDir('public/__static');
