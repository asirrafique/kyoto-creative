const fs = require('fs');

const html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes = [...html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)];
let tree = '';
for (const p of pPushes) {
  const s = JSON.parse(p[1])[1];
  if (s.startsWith('e:[[[')) {
    tree = s;
    break;
  }
}
console.log('Tree length:', tree.length);

const definedIds = new Set();
pPushes.forEach(p => {
  const s = JSON.parse(p[1])[1];
  const modMatches = [...s.matchAll(/([0-9a-f]+):I\[/g)];
  modMatches.forEach(mm => definedIds.add(mm[1]));
});
console.log('Defined IDs:', [...definedIds]);

const lRefs = [...tree.matchAll(/"\$L([0-9a-f]+)"/g)].map(m => m[1]);
console.log('Used $L refs in tree:', [...new Set(lRefs)]);

const missing = [...new Set(lRefs)].filter(id => !definedIds.has(id));
console.log('MISSING component IDs in Green Square Infra:', missing);
