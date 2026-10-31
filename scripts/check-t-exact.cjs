const fs = require('fs');

const f88 = fs.readFileSync('scripts/liveFlight88.txt', 'utf8');

// Find next chunk ID after 26:T
const tIdx = f88.indexOf('26:T');
const nextIdx = f88.indexOf('\n35:I[', tIdx);
console.log('26:T starts at', tIdx, 'next chunk 35:I[ starts at', nextIdx);
const hexLen = f88.slice(tIdx + 4, f88.indexOf(',', tIdx));
const textContent = f88.slice(f88.indexOf(',', tIdx) + 1, nextIdx);

console.log('Hex len:', hexLen, 'Parsed len:', parseInt(hexLen, 16));
console.log('Buffer byteLength:', Buffer.byteLength(textContent, 'utf8'));
console.log('Character length:', textContent.length);
