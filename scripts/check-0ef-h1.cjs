const fs = require('fs');

const f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

console.log('0ef3d4 original heading:');
const h1 = f.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
console.log(h1 ? h1[1] : null);
