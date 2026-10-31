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
const lineStart = 21031;
const line = stream.slice(lineStart, stream.indexOf('\n', lineStart));
const id = '27';
const hex = '74b';
const len = parseInt(hex, 16);
console.log('Hex len:', len);
console.log('Header length:', ('27:T74b,').length);
const textBlock = line.slice(('27:T74b,').length, ('27:T74b,').length + len);
console.log('textBlock length:', textBlock.length);
const after = line.slice(('27:T74b,').length + len);
console.log('After textBlock starts with:', after.slice(0, 50));
