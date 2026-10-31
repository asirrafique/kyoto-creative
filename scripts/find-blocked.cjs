const fs = require('fs');
const js = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', 'utf8');

const target = '"blocked"';
let idx = 0;
while ((idx = js.indexOf(target, idx)) !== -1) {
  console.log('blocked at', idx, js.substring(idx - 60, idx + 80));
  idx += target.length;
}
