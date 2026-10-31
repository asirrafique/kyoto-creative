const fs = require('fs');
const html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const idx = html.indexOf('The Challenge');
console.log('Green Square section wrapper:');
console.log(html.slice(idx - 300, idx + 100));
