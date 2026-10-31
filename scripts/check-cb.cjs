const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const sIdx = html.indexOf('ContentBuilder_contentBuilder__FAKQG');
console.log('Around ContentBuilder:');
console.log(html.slice(sIdx - 100, sIdx + 200));
