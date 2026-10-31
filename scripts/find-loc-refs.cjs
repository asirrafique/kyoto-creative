const fs = require('fs');

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

console.log('localize.mjs length:', loc.length);
// Find all references to 00233791 or seven-gate or bucher
const lines = loc.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('00233791') || l.includes('seven-gate') || l.includes('bucher') || l.includes('Green Square')) {
    console.log(`Line ${idx}:`, l.slice(0, 150));
  }
});
