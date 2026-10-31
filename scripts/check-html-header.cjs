const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

// Find after </header>
const idxHeader = html.indexOf('</header>');
console.log('After </header>:');
console.log(html.slice(idxHeader, idxHeader + 300));
