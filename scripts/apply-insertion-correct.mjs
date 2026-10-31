import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// 1. HTML cut:
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const pStrategy = html.indexOf('Five strategic pillars became the foundation');
const pCutStart = html.indexOf('</section><section class="MediaGallery_mediaGallery', pStrategy) + 10;
const pLargeCta = html.indexOf('<section class="LargeCta_largeCta__ylf5C">');
let htmlCut = html.substring(pCutStart, pLargeCta - 10);
// Apply earlier text substitutions that happened before this cut:
htmlCut = htmlCut.replaceAll('Bucher + Suter', 'Seven Gate Holdings');

// 2. Flight / RSC cut:
const rsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');
const pRscCutStart = rsc.indexOf('],["$","section",null,{"className":"MediaGallery_mediaGallery');
const pRscCutEnd = rsc.indexOf('"$L24"');
let rscCut = rsc.substring(pRscCutStart, pRscCutEnd);
rscCut = rscCut.replaceAll('Bucher + Suter', 'Seven Gate Holdings');

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
let clientCut = val1.substring(pClientCutStart, pClientCutEnd);
clientCut = clientCut.replaceAll('Bucher + Suter', 'Seven Gate Holdings');

// Target replacements
const htmlSection = fs.readFileSync('scripts/final_html_section.txt', 'utf8');
const htmlFlightSection = fs.readFileSync('scripts/final_html_flight_section.txt', 'utf8');
const rscFlightSection = fs.readFileSync('scripts/final_rsc_flight_section.txt', 'utf8');

console.log('htmlCut length:', htmlCut.length);
console.log('rscCut length:', rscCut.length);
console.log('clientCut length:', clientCut.length);

const targetAnchor = `text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');`;

const addition = `${targetAnchor}
  // Replace intermediate sections with the Results/Impact/Quote section on Seven Gate Holdings
  text = text.replaceAll(${JSON.stringify(htmlCut)}, ${JSON.stringify(htmlSection)});
  text = text.replaceAll(${JSON.stringify(rscCut)}, ${JSON.stringify(',[' + rscFlightSection + '],')});
  text = text.replaceAll(${JSON.stringify(clientCut)}, ${JSON.stringify(',[' + htmlFlightSection + '],')});`;

const updated = loc.replace(targetAnchor, addition);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Successfully updated localize.mjs with transformed cut targets!');
