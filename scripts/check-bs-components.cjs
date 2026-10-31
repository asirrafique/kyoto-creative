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

['2941', '32743'].forEach(id => {
  text.split('\n').forEach(l => {
    if (l.includes(id)) console.log(`Found ${id}: ${l}`);
  });
});
