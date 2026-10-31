const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

const parts = [];
ref.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
  return '';
});

const stream = parts.join('');
console.log('Stream length:', stream.length);
const rows = stream.split('\n');
console.log('Stream rows count:', rows.length);
for (const r of rows) {
  if (r.startsWith('2c:') || r.startsWith('2b:') || r.startsWith('2a:')) {
    console.log(r.slice(0, 80));
  }
}
