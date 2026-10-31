const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

// Find renderWithHooks or updateFunctionComponent or mountIndeterminateComponent
// Search for "Minified React error"
console.log('Includes #130?:', f.includes('Minified React error #130'));
console.log('Includes #418?:', f.includes('418'));
console.log('Includes #423?:', f.includes('423'));
console.log('Includes #425?:', f.includes('425'));

// Let's hook window.onerror or React error boundaries by adding a console.log in the main chunk
