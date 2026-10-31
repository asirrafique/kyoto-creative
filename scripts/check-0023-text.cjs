const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find all occurrences of "We approached the project" or "bespoke website built around"
console.log('approached:', f.includes('approached the project'));
console.log('bespoke website:', f.includes('bespoke website'));
console.log('More Than a Website:', f.includes('More Than a Website'));
