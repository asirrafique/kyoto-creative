import fs from 'fs';

const ref = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Find occurrences of bucher-suter in localize.mjs
let idx = 0;
while ((idx = ref.indexOf('bucher-suter', idx)) !== -1) {
  console.log('Found bucher-suter at', idx);
  console.log(ref.slice(Math.max(0, idx - 40), idx + 80));
  idx += 12;
}
