const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', 'utf8');

// Hook the chunk decoder:
// Find `switch(_+=S.decode(p),O)`
const target = 'switch(_+=S.decode(p),O)';
console.log('Includes target?:', f.includes(target));
const hooked = 'console.log("[CHUNK DECODED]", String.fromCharCode(O), typeof y!=="undefined"?y:"", (_||"").slice(0, 40));switch(_+=S.decode(p),O)';
f = f.replace(target, hooked);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', f, 'utf8');
console.log('Hooked chunk decoder!');
