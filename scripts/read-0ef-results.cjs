const fs = require('fs');

const f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const idx = f.indexOf('Results 30 days');
console.log('Results 30 days at:', idx);
console.log(f.slice(idx - 100, idx + 800));
