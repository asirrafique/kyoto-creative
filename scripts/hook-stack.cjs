const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

// Where are the calls to i(460), i(474), i(461)?
// Let's log the error object or stack trace inside function i(e):
const target = ';function i(e){console.warn("[REACT ERROR TRAPPED #"+e+"]",Array.from(arguments));var t="https://react.dev/errors/"+e;';
const detailed = ';function i(e){console.warn("[REACT ERROR TRAPPED #"+e+"]",Array.from(arguments),(new Error()).stack);var t="https://react.dev/errors/"+e;';

f = f.replace(target, detailed);
fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', f, 'utf8');
console.log('Added stack trace to function i(e)!');
