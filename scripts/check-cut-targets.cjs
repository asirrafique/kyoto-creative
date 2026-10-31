const fs = require('fs');
const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const regex = /text = text\.replaceAll\(([\s\S]*?),/g;
let m;
const targets = [];
while ((m = regex.exec(loc)) !== null) {
  if (m[1].includes('bs-after.jpg')) {
    targets.push(m[1]);
  }
}
console.log('Matching cut targets in localize.mjs:', targets.length);
targets.forEach((t, i) => {
  try {
    const val = JSON.parse(t);
    console.log(`Target ${i+1}: Length ${val.length}, startsWith ${JSON.stringify(val.slice(0, 30))}, endsWith ${JSON.stringify(val.slice(val.length - 30))}`);
  } catch (e) {
    console.log(`Target ${i+1} JSON error: ${e.message}`);
  }
});
