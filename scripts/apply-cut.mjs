import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// 1. HTML cut:
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const pStrategy = html.indexOf('Five strategic pillars became the foundation');
const pCutStart = html.indexOf('</section><section class="MediaGallery_mediaGallery', pStrategy) + 10;
const pLargeCta = html.indexOf('<section class="LargeCta_largeCta__ylf5C">');
const htmlCut = html.substring(pCutStart, pLargeCta - 10);

// 2. Flight / RSC cut:
const rsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');
const pRscCutStart = rsc.indexOf('],["$","section",null,{"className":"MediaGallery_mediaGallery');
const pRscCutEnd = rsc.indexOf('"$L24"');
const rscCut = rsc.substring(pRscCutStart, pRscCutEnd);

// 3. Client flight push cut:
const regex = /<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g;
let m;
let val1;
while ((m = regex.exec(html)) !== null) {
  if (m[1].includes('bs-after.jpg')) {
    val1 = JSON.parse(m[1])[1];
    break;
  }
}
const pClientCutStart = val1.indexOf('],["$","section",null,{"className":"MediaGallery_mediaGallery');
const pClientCutEnd = val1.indexOf('"$L32"');
const clientCut = val1.substring(pClientCutStart, pClientCutEnd);

console.log('htmlCut length:', htmlCut.length);
console.log('rscCut length:', rscCut.length);
console.log('clientCut length:', clientCut.length);

const targetAnchor = `text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');`;

const addition = `${targetAnchor}
  // Remove intermediate sections between More Than a Website and Large CTA on Seven Gate Holdings
  text = text.replaceAll(${JSON.stringify(htmlCut)}, '');
  text = text.replaceAll(${JSON.stringify(rscCut)}, '');
  text = text.replaceAll(${JSON.stringify(clientCut)}, '');`;

const updated = loc.replace(targetAnchor, addition);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Successfully added removals to localize.mjs');
