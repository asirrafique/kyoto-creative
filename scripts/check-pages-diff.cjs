const fs = require('fs');

const p88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const pSeven = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const pGreen = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

console.log('88Pilot length:', p88.length);
console.log('Seven Gate length:', pSeven.length);
console.log('Green Square length:', pGreen.length);

console.log('88Pilot has __next_f:', p88.includes('__next_f'));
console.log('Seven Gate has __next_f:', pSeven.includes('__next_f'));
console.log('Green Square has __next_f:', pGreen.includes('__next_f'));
