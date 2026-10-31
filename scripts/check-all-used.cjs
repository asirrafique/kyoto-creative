const fs = require('fs');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const defined = new Set();
pPushes0ef.forEach(p => {
  const s = JSON.parse(p[1])[1];
  [...s.matchAll(/([0-9a-f]+):I\[/g)].forEach(m => defined.add(m[1]));
});
console.log('Defined IDs:', [...defined].sort());

const s15 = JSON.parse(pPushes0ef[15][1])[1];
const used = [...s15.matchAll(/"\$L([0-9a-f]+)"/g)].map(m => m[1]);
console.log('Used IDs in full tree:', [...new Set(used)].sort());
console.log('Missing IDs in full tree:', [...new Set(used)].filter(id => !defined.has(id)));
