const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const sIdx = html.indexOf('TextAndDescription_text__');
console.log('TextAndDescription:', sIdx);
if (sIdx !== -1) {
  console.log(html.slice(sIdx - 100, sIdx + 400));
} else {
  // Let's find any text block
  const match = html.match(/<div class="[^"]*text[^"]*">/i);
  console.log('Match text:', match);
}
