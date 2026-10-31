const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find where LargeCta begins
const idxCta = f.indexOf('LargeCta_largeCta');
console.log('LargeCta at:', idxCta);
console.log(f.slice(idxCta - 500, idxCta + 300));
