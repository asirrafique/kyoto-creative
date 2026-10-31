const fs = require('fs');

function searchAllCSS(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = dir + '/' + f;
    if (fs.statSync(full).isDirectory()) searchAllCSS(full);
    else if (f.endsWith('.css')) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.includes('ProjectCard_project__')) {
        console.log('Found in:', full);
        // Find small and large
        const idx = c.indexOf('ProjectCard_project__');
        console.log(c.slice(idx - 50, idx + 600));
      }
    }
  }
}

searchAllCSS('public/__static');
