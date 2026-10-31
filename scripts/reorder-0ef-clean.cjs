const fs = require('fs');

let html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const pPushes = [...html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)];

const s35 = pPushes.find(p => p[1].includes('35:I[57372'))[0];
const sTree = pPushes.find(p => p[1].startsWith('[1,"e:[[['))[0];

console.log('s35 length:', s35.length, 'sTree length:', sTree.length);

const idx35 = html.indexOf(s35);
const idxTree = html.indexOf(sTree);

console.log('idx35:', idx35, 'idxTree:', idxTree);

if (idx35 > idxTree) {
  html = html.replace(s35, '');
  html = html.replace(sTree, s35 + '\n' + sTree);
  fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', html, 'utf8');
  console.log('Successfully moved s35 before sTree!');
}
