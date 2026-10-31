const fs = require('fs');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];

const defined = new Set();
pPushes0ef.forEach(p => {
  const s = JSON.parse(p[1])[1];
  [...s.matchAll(/([0-9a-f]+):I\[/g)].forEach(m => defined.add(m[1]));
});

const s15_0ef = JSON.parse(pPushes0ef[15][1])[1];
const parsed = JSON.parse(s15_0ef.slice(2));
const bento = parsed[2][3].children[1];

const used = [...JSON.stringify(bento).matchAll(/"\$L([0-9a-f]+)"/g)].map(m => m[1]);
console.log('Bento used IDs:', used);
console.log('Bento missing IDs:', used.filter(id => !defined.has(id)));
