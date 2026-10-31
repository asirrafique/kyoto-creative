const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const p13 = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)][13][1];
const unescaped = JSON.parse('"' + p13 + '"');
const parsed = JSON.parse(unescaped.slice(unescaped.indexOf(':') + 1));

parsed[2][3].children.forEach((c, i) => {
  console.log(i, c ? c[0] : null, c && c[3] ? c[3].className : 'no class');
});
