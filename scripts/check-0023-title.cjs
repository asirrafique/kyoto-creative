const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const title = f.match(/<title>(.*?)<\/title>/);
console.log('0023 Title:', title ? title[1] : null);

// h1
const h1 = f.match(/<h1[^>]*>(.*?)<\/h1>/);
console.log('0023 h1:', h1 ? h1[1] : null);
