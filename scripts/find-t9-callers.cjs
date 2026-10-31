const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('function t9(e){');
console.log('function t9 caller in completeWork / l6:');

let pos = 0;
while ((pos = chunk.indexOf('t9(', pos)) !== -1) {
  console.log('t9 call at', pos, ':', chunk.slice(Math.max(0, pos - 50), pos + 100));
  pos += 3;
}
