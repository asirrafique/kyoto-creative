const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const pos = html.indexOf('BAILOUT_TO_CLIENT_SIDE_RENDERING');
console.log('Snippet around BAILOUT in HTML:');
console.log(html.slice(pos - 100, pos + 150));
