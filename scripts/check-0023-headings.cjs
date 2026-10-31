const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find all <h2> in 00233791
const h2s = [...f.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('00233791 h2s:');
console.log(h2s);

// Find where Five strategic pillars is
const idxPillars = f.indexOf('Five strategic pillars');
console.log('Surrounding Five strategic pillars:');
console.log(f.slice(idxPillars - 300, idxPillars + 300));
