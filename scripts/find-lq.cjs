const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const idx = chunk.indexOf('case 5:console.log("Reconciler processing tag 5 fiber');
// Let's replace the reconciler log with a simpler one and log what tag is being processed in beginWork
const idxBegin = chunk.indexOf('function lQ(e,t){');
console.log('lQ at:', idxBegin);
if (idxBegin !== -1) {
  console.log(chunk.slice(idxBegin, idxBegin + 300));
}
