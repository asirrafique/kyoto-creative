const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'function t8(e){console.log("t8 HYDRATION MISMATCH DETECTED for:", e.type, e.tag);return false}',
  'function t8(e){console.log("t8 HYDRATION MISMATCH DETECTED for:", e.type, e.tag, e.stateNode, e.memoizedProps?.className || e.pendingProps?.className);return false}'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched t8 with detailed log!');
