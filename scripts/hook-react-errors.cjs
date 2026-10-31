const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const target = ';function i(e){var t="https://react.dev/errors/"+e;';
const hooked = ';function i(e){console.warn("[REACT ERROR TRAPPED #"+e+"]",Array.from(arguments));var t="https://react.dev/errors/"+e;';

console.log('Includes target?:', f.includes(target));
f = f.replace(target, hooked);
fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', f, 'utf8');
console.log('Successfully hooked function i(e)!');
