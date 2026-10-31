const fs = require('fs');

const h88 = fs.readFileSync('scripts/live88.html', 'utf8');
const hGs = fs.readFileSync('scripts/liveGs.html', 'utf8');

const s88 = [...h88.matchAll(/<script[\s\S]*?<\/script>/g)].map(m => m[0]);
const sGs = [...hGs.matchAll(/<script[\s\S]*?<\/script>/g)].map(m => m[0]);

console.log('s88 count:', s88.length);
console.log('sGs count:', sGs.length);

s88.forEach((s, i) => {
  const g = sGs[i];
  if (!g) {
    console.log(`sGs missing script ${i}`);
  } else if (s !== g) {
    console.log(`Script ${i} mismatch: s88 len=${s.length}, sGs len=${g.length}`);
    console.log('s88 start:', s.slice(0, 60));
    console.log('sGs start:', g.slice(0, 60));
  }
});
