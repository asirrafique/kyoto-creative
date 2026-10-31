const fs = require('fs');

const f = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.rsc', 'utf8');

// Find occurrences of size: or size in rsc
let pos = 0;
while ((pos = f.indexOf('size', pos)) !== -1) {
  console.log('size at', pos, ':', f.slice(Math.max(0, pos - 50), pos + 100));
  pos += 4;
}
