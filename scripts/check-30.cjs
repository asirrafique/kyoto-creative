const fs = require('fs');

const orig88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
function getParts(html) {
  const parts = [];
  html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
    try {
      const value = JSON.parse(data);
      if (value[0] === 1) parts.push(value[1]);
    } catch {}
  });
  return parts.join('');
}
const flight = getParts(orig88);
const match30 = flight.match(/30:[^,\n]+,[^\n]+/);
if (match30) {
  console.log('30 in flight:', match30[0].slice(0, 100));
} else {
  console.log('No 30 found in flight!');
  const allIds = flight.match(/^[0-9a-f]+:/mg);
  console.log('All IDs:', allIds ? allIds.join(' ') : 'none');
}
