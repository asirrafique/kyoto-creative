const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

// Restore original function i(e):
f = f.replace(/;function i\(e\)\{console\.warn\(.*?\);var t="https:\/\/react\.dev\/errors\/"\+e;/, ';function i(e){var t="https://react.dev/errors/"+e;');
fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', f, 'utf8');
console.log('Restored original function i(e)!');
