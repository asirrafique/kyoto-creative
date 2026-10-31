const fs = require('fs');
const upp = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const parts = [];
upp.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
});
const text = parts.join('');

const idx = text.indexOf('Results 30 days post-launch');
console.log('Results in UPP parts:', idx);
if (idx !== -1) {
  const start = text.lastIndexOf('["$","section"', idx);
  console.log('Snippet from start:');
  console.log(text.slice(start, start + 350));
}
