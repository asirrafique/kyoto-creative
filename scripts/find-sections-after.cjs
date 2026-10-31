const fs = require('fs');

const f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find all </section> after 14000
let pos = 14000;
while ((pos = f.indexOf('</section>', pos)) !== -1) {
  console.log('</section> at', pos, 'followed by:', f.slice(pos + 10, pos + 80));
  pos += 10;
}
