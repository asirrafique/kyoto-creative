const fs = require('fs');

const f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const title = f.match(/<title>(.*?)<\/title>/);
console.log('0ef3d4 Title:', title ? title[1] : null);

// Look for intro text
const intro = f.match(/<div class="prose">([\s\S]*?)<\/div>/);
console.log('0ef3d4 Intro prose:', intro ? intro[1].slice(0, 300) : null);
