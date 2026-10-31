const fs = require('fs');

const f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const ps = [...f.matchAll(/<p[^>]*>(.*?)<\/p>/gs)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('0ef3d4 paragraphs:');
ps.forEach((p, i) => console.log(`[${i}]`, p.slice(0, 100)));
