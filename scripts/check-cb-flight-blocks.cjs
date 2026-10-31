const fs = require('fs');

const html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const p15 = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)][15][1];
const unescaped = JSON.parse('"' + p15 + '"');
const parsed = JSON.parse(unescaped.slice(unescaped.indexOf(':') + 1));

const cb = parsed[2][3].children[3];
console.log('cb.children count:', cb[3].children.length);

cb[3].children.forEach((c, idx) => {
  const str = JSON.stringify(c);
  console.log(idx, c[1], c[3] ? c[3].className : 'no class', str.slice(0, 80));
});
