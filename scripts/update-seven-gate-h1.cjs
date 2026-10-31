const fs = require('fs');

const targetStr = 'How Seven Gate Holdings found brand clarity through a new strategy with KOTA';
const replacementStr = 'A World-Class Digital Presence Built to Match the Vision';

// 1. Update HTML file
const htmlPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
let html = fs.readFileSync(htmlPath, 'utf8');
console.log('HTML occurrences before:', (html.match(new RegExp(targetStr, 'g')) || []).length);
html = html.replaceAll(targetStr, replacementStr);
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Updated HTML file!');

// 2. Update RSC file
const rscPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc';
let rsc = fs.readFileSync(rscPath, 'utf8');
const oldBucher = 'How Bucher + Suter found brand clarity through a new strategy with KOTA';
console.log('RSC occurrences of oldBucher before:', (rsc.match(new RegExp(oldBucher, 'g')) || []).length);
rsc = rsc.replaceAll(oldBucher, replacementStr);
rsc = rsc.replaceAll(targetStr, replacementStr);
fs.writeFileSync(rscPath, rsc, 'utf8');
console.log('Updated RSC file!');
