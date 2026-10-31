const fs = require('fs');

const orig88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const p1Match = [...orig88.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
const p15 = p1Match[15][1];
const unescaped = JSON.parse('"' + p15 + '"');
const colonIdx = unescaped.indexOf(':');
const jsonStr = unescaped.slice(colonIdx + 1);
const parsed = JSON.parse(jsonStr);

console.log('88 parsed sections:');
parsed[2][3].children.forEach((c, i) => {
  console.log(i, c ? c[0] : null, c && c[3] ? c[3].className : null);
});
