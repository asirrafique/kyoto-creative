const fs = require('fs');

const rsc = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.rsc', 'utf8');
const lines = rsc.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('60119') || line.includes('78267') || line.includes('seven-gate-holdings') || line.includes('bucher-suter')) {
    console.log(`Line ${i} prefix:`, line.slice(0, 150), '... length:', line.length);
  }
}
