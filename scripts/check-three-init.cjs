const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/4143-6b83e17252ec01c2.js', 'utf8');

// Find module export of w:
const idx = f.indexOf('var w=function(t)');
console.log('Snippet after w:', f.slice(idx, idx + 600));
