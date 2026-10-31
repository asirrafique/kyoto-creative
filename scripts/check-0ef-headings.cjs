const fs = require('fs');

const f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const h2s = [...f.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('0ef3d4 h2s:');
console.log(h2s);

const p1 = f.indexOf('More Than a Website');
const p2 = f.indexOf('More than a Website');
console.log('0ef3d4 has More Than a Website?', p1, p2);
