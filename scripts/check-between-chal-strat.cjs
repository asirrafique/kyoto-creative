const fs = require('fs');
const html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const chalIdx = html.indexOf('A website worthy of');
const stratIdx = html.indexOf('Cinematic storytelling through WebGL');

console.log('Chal index:', chalIdx, 'Strat index:', stratIdx);
const between = html.slice(chalIdx, stratIdx);
console.log('Between markup:');
console.log(between);
