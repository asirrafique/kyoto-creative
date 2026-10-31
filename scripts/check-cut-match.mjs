import fs from 'node:fs';

const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const pStrategy = html.indexOf('Five strategic pillars became the foundation');
const pCutStart = html.indexOf('</section><section class="MediaGallery_mediaGallery', pStrategy) + 10;
const pLargeCta = html.indexOf('<section class="LargeCta_largeCta__ylf5C">');
const htmlCut = html.substring(pCutStart, pLargeCta - 10);

console.log('html contains htmlCut?', html.includes(htmlCut));

// In localize.mjs, what replaced Bucher + Suter before this cut?
// Notice: inside htmlCut, does it contain "Bucher + Suter"?
console.log('htmlCut contains Bucher + Suter?', htmlCut.includes('Bucher + Suter'));
