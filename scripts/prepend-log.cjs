const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// Prepend console.log to chunk execution
const patched = 'console.log("CHUNK page-5b3919766e28ce0e.js EXECUTING!");\n' + chunk;
fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', patched, 'utf8');
console.log('Prepended log to chunk!');
