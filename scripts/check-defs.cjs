const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

// Find all definition rows in the agency reference file
// In Flight format, modules are defined like:
// 2c:I["static/chunks/...js", ["default"], ...] or similar
const rows = ref.split('\n');
console.log('Total rows in reference:', rows.length);
const definitions = new Map();
for (const row of rows) {
  const m = row.match(/^([0-9a-fA-F]+):([I|M|H|E]?)(.*)/);
  if (m) {
    definitions.set(m[1], { type: m[2], content: m[3].slice(0, 50) });
  }
}
console.log('Definitions found:', Array.from(definitions.keys()).slice(0, 20));

// Check what $L2c is!
console.log('Definition of 2c:', definitions.get('2c'));
console.log('Definition of 2b:', definitions.get('2b'));
