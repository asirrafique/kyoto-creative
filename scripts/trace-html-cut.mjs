import fs from 'node:fs';

const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const pStrategy = html.indexOf('Five strategic pillars became the foundation');
const pCutStart = html.indexOf('</section><section class="MediaGallery_mediaGallery', pStrategy) + 10;
const pLargeCta = html.indexOf('<section class="LargeCta_largeCta__ylf5C">');
let rawHtmlCut = html.substring(pCutStart, pLargeCta - 10);

console.log('rawHtmlCut length:', rawHtmlCut.length);

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Trace step-by-step through localize on html
let text = html;
const lines = loc.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('htmlCut') || (line.includes('text.replaceAll(') && line.includes('MediaGallery'))) {
    console.log(`Line ${i+1}: text contains target?`, text.includes(rawHtmlCut));
    if (!text.includes(rawHtmlCut)) {
      console.log('Target lost before line', i+1);
      break;
    }
  }
}
