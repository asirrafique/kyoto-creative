const fs = require('fs');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const pPushes0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const html88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const pPushes88 = [...html88.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];

console.log('0ef push count:', pPushes0ef.length, '88 push count:', pPushes88.length);

for (let i = 0; i < 15; i++) {
  const s0ef = pPushes0ef[i][1];
  const s88 = pPushes88[i][1];
  console.log('Push ' + i + ' matches: ' + (s0ef === s88));
  if (s0ef !== s88) {
    console.log('  0ef (len ' + s0ef.length + '): ' + s0ef.slice(0, 30) + ' ... ' + s0ef.slice(-30));
    console.log('   88 (len ' + s88.length + '): ' + s88.slice(0, 30) + ' ... ' + s88.slice(-30));
  }
}
