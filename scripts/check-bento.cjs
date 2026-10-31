const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const bentoIdx = html.indexOf('Bento_bento__pskN5');
console.log('Bento index:', bentoIdx);
console.log(html.slice(bentoIdx - 30, bentoIdx + 200));
