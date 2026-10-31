const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

// Find string parsing / chunk reading in RSC stream client
// RSC text chunk starts with `T<hex>,`
const tIdx = f.indexOf(':T');
console.log(':T in chunk fd9d:', tIdx);
if (tIdx !== -1) {
  console.log(f.slice(tIdx - 100, tIdx + 100));
} else {
  // search for parseInt(..., 16)
  const pIdx = f.indexOf('parseInt(');
  console.log('parseInt snippet:', f.slice(pIdx, pIdx + 100));
}
