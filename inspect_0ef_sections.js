const fs = require('fs');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\(([\s\S]*?)\)<\/script>/g)];
const s15_0ef = JSON.parse(pPushes0ef.find(p => p[1].includes('"e:[[['))[1])[1];
const parsed = JSON.parse(s15_0ef.slice(2));
console.log('0ef parsed[2][3].children:');
parsed[2][3].children.forEach((c, idx) => {
  if (c) console.log(idx, c[1], c[3]?.className);
});

// Let's inspect the Bento component
const bento = parsed[2][3].children[1];
console.log('Bento node component tag/module:', bento[1]);
console.log('Bento node props keys:', Object.keys(bento[3] || {}));
