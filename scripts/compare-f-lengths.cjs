const fs = require('fs');

const html = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const pSeven = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const f88 = [...html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)].map(m => m[1]);
const fSeven = [...pSeven.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)].map(m => m[1]);

console.log('88 count:', f88.length, 'Seven count:', fSeven.length);
for (let i = 0; i < Math.min(f88.length, fSeven.length); i++) {
  console.log('Index ' + i + ' - 88 len: ' + f88[i].length + ', Seven len: ' + fSeven[i].length);
}
