const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');

const parts = [];
ref.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
  return '';
});

const stream = parts.join('');
const idx = 28867;
const lineStart = stream.lastIndexOf('\n', idx) + 1;
console.log('lineStart:', lineStart);
console.log('lineStart prefix:', stream.slice(lineStart, lineStart + 40));
