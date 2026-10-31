const fs = require('fs');

const html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const p0ef = [...html0ef.matchAll(/<script[^>]*>\s*self\.__next_f\.push\((.*?)\)<\/script>/gs)];

for (let i = 0; i < p0ef.length; i++) {
  const s = JSON.parse(p0ef[i][1])[1];
  const lines = s.split('\n');
  const prefixes = lines.map(l => (l.match(/^([0-9a-f]+:)/) || [])[1]).filter(Boolean);
  console.log('Push ' + i + ' (len ' + s.length + '): defined -> ' + prefixes.join(', '));
}
