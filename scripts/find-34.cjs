const fs = require('fs');

const html = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const fMatches = [...html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const str = JSON.parse(fMatches[14][1])[1];

const idx = str.indexOf('$L34');
console.log('Index of $L34:', idx);
if (idx !== -1) {
  console.log('Context of $L34:');
  console.log(str.slice(Math.max(0, idx - 150), Math.min(str.length, idx + 150)));
}
