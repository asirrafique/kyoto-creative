const fs = require('fs');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const s15_0ef = JSON.parse(pPushes0ef[15][1])[1];
const parsed = JSON.parse(s15_0ef.slice(2));
const e2 = parsed[2];
const cb = e2[3].children[3];
const blocks = cb[3].children;
console.log('cb blocks count:', blocks.length);
blocks.forEach((b, i) => {
  const str = JSON.stringify(b);
  const m = str.match(/https:[^"']+\.mp4/);
  if (m) console.log(i + ' ' + b[1] + ': ' + m[0]);
});
