const fs = require('fs');

let html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const pushes = [...html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)].map(m => m[0]);
console.log('Total push scripts in file:', pushes.length);

const s35 = pushes.find(p => p.includes('35:I[57372'));
const sTree = pushes.find(p => p.includes('canonical') && p.includes('UPP - KOTA'));

console.log('s35 found:', !!s35, 'sTree found:', !!sTree);

const idx35 = html.indexOf(s35);
const idxTree = html.indexOf(sTree);
console.log('idx35:', idx35, 'idxTree:', idxTree);

if (idx35 > idxTree) {
  html = html.replace(s35, '');
  html = html.replace(sTree, s35 + '\n' + sTree);
  fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', html, 'utf8');
  console.log('Successfully re-ordered s35 before sTree in 0ef...html!');
}
