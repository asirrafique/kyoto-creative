const fs = require('fs');

const f88 = fs.readFileSync('scripts/liveFlight88.txt', 'utf8');
const fGs = fs.readFileSync('scripts/liveFlightGs.txt', 'utf8');

const t26_88_idx = f88.indexOf('26:T');
console.log('88 26:T to next chunk:');
const nextAfter88 = f88.slice(t26_88_idx, t26_88_idx + 2250);
console.log(nextAfter88.slice(nextAfter88.length - 100));

const t26_gs_idx = fGs.indexOf('26:T');
console.log('GS 26:T to next chunk:');
const nextAfterGs = fGs.slice(t26_gs_idx, t26_gs_idx + 2250);
console.log(nextAfterGs.slice(nextAfterGs.length - 100));
