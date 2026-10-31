const fs = require('fs');

const f = 'reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html';
const content = fs.readFileSync(f, 'utf8');

const sIdx = content.indexOf('<h2>Introduction</h2>');
const eIdx = content.indexOf('Intro_projectDetails__UWcsm', sIdx);
console.log('Complete Intro prose DOM:');
console.log(content.substring(sIdx, eIdx - 20));

const fIdx = content.indexOf('Introduction', 50000);
const fStart = content.lastIndexOf('__html', fIdx);
const fEnd = content.indexOf('Intro_projectDetails__UWcsm', fIdx);
console.log('Complete Intro prose Flight:');
console.log(content.substring(fStart, fEnd - 30));
