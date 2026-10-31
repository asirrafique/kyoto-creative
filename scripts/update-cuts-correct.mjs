import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const pStrategy = html.indexOf('Five strategic pillars became the foundation');
const pCutStart = html.indexOf('</section><section class="MediaGallery_mediaGallery', pStrategy) + 10;
const pLargeCta = html.indexOf('<section class="LargeCta_largeCta__ylf5C">');
// Since Bucher + Suter was already replaced by Seven Gate Holdings:
const htmlCut = html.substring(pCutStart, pLargeCta - 10).replaceAll('Bucher + Suter', 'Seven Gate Holdings');

const rsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');
const pRscCutStart = rsc.indexOf('],["$","section",null,{"className":"MediaGallery_mediaGallery');
const pRscCutEnd = rsc.indexOf('"$L24"');
const rscCut = rsc.substring(pRscCutStart, pRscCutEnd).replaceAll('Bucher + Suter', 'Seven Gate Holdings');

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
const clientCut = val1.substring(pClientCutStart, pClientCutEnd).replaceAll('Bucher + Suter', 'Seven Gate Holdings');

const targetAnchor = `// Remove intermediate sections between More Than a Website and Large CTA on Seven Gate Holdings`;
const pTarget = loc.indexOf(targetAnchor);
const pEnd = loc.indexOf(';', loc.indexOf('clientCut', pTarget)) + 1;

const newCode = `// Remove intermediate sections between More Than a Website and Large CTA on Seven Gate Holdings
  text = text.replaceAll(${JSON.stringify(htmlCut)}, '');
  text = text.replaceAll(${JSON.stringify(rscCut)}, '');
  text = text.replaceAll(${JSON.stringify(clientCut)}, '');`;

const updated = loc.substring(0, pTarget) + newCode + loc.substring(pEnd);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Updated cuts with Seven Gate Holdings');
