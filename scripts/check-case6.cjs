const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('case 6:break;default:throw Error(i(329');
console.log('case 6 in chunk:', idx);

if (idx === -1) {
  // Check where switch(a=e,t) is
  const sIdx = chunk.indexOf('switch(a=e,t)');
  console.log('switch(a=e,t) at:', sIdx);
  if (sIdx !== -1) {
    console.log(chunk.slice(sIdx, sIdx + 200));
  }
}
