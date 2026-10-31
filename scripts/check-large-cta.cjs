const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const parts = [];
html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
});
const text = parts.join('');

text.split('\n').forEach(row => {
  if (row.includes('LargeCta_largeCta__ylf5C')) {
    console.log('Row with LargeCta:', row.slice(0, 150));
  }
});
