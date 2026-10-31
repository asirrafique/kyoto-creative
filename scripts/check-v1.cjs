const fs = require('fs');

const pGreen = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const vIdx = pGreen.indexOf('<video loop="" muted="" playsInline=""></video>');
console.log('Video 1 context:');
console.log(pGreen.slice(Math.max(0, vIdx - 300), Math.min(pGreen.length, vIdx + 300)));
