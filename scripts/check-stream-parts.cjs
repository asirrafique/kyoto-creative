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

console.log('Parts count:', parts.length);
const stream = parts.join('');
console.log('Stream total length:', stream.length);
const rows = stream.split('\n');
console.log('Rows count:', rows.length);
for (let i = 0; i < rows.length; i++) {
  if (rows[i].includes('ContactDetails_addresses__lHCN1') || rows[i].includes('477 Madison Ave')) {
    console.log(`Row ${i} prefix:`, rows[i].slice(0, 15));
    console.log(`Row ${i} length:`, rows[i].length);
  }
}
