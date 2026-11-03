const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const sIdx = html.indexOf('<section class="Quote_quote__');
const eIdx = html.indexOf('</section>', sIdx);
console.log('Quote DOM in Seven Gate:');
console.log(html.slice(sIdx, eIdx + 10));
