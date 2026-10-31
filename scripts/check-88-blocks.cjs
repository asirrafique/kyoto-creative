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

const flight88 = getParts(orig88);
const eIdx = flight88.indexOf('\ne:[[[');
const eStr = flight88.slice(eIdx + 3); // starts with [[["$","title"...
const parsedE = JSON.parse(eStr);
console.log('parsedE is array of length:', parsedE.length);
console.log('Content sections in parsedE[2][3].children:');
parsedE[2][3].children.forEach((c, i) => {
  console.log(i, c ? c[0] : null, c && c[3] ? c[3].className : null);
});
