const fs = require('fs');

const reactChunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

// Search for BAILOUT_TO_CLIENT_SIDE_RENDERING or l0
const idx = reactChunk.indexOf('BAILOUT_TO_CLIENT_SIDE_RENDERING');
console.log('BAILOUT index in React chunk:', idx);

// Search for 419 (BailoutToCSRError)
const matches419 = [];
let pos = 0;
while ((pos = reactChunk.indexOf('419', pos)) !== -1) {
  matches419.push(pos);
  pos += 3;
}
console.log('Matches for 419:', matches419);
matches419.forEach(m => {
  console.log('Around 419:', reactChunk.slice(Math.max(0, m - 50), m + 100));
});
