const fs = require('fs');

const f = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
console.log('88pilot page length:', f.length);
console.log('88pilot preview:');
console.log(f.slice(0, 500));
