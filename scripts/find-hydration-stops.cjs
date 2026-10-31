const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

// Search for where `i(418)` or `i(423)` or `i(425)` or `error` is thrown during hydration.
// Let's find all occurrences of `i(` in f:
const calls = [...f.matchAll(/i\(([0-9]+)\)/g)];
console.log('Total calls to i(number):', calls.length);
const codes = new Set(calls.map(c => c[1]));
console.log('Unique error codes called with i(...):', [...codes].sort());
