const fs = require('fs');

const html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');
const p15 = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)][15][1];
const unescaped = JSON.parse('"' + p15 + '"');
const parsed = JSON.parse(unescaped.slice(unescaped.indexOf(':') + 1));

const intro = parsed[2][3].children[2];
console.log('Intro section JSON:');
console.log(JSON.stringify(intro, null, 2));
