const fs = require('fs');

const rsc = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.rsc', 'utf8');
const lines = rsc.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('$L20') || line.includes('$L1f') || line.includes('$20') || line.includes('$1f')) {
    console.log(`Line ${i} matched:`, line.slice(0, 200));
  }
}
