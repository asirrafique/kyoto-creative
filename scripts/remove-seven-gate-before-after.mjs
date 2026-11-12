import fs from 'fs';

const htmlFile = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
const rscFile = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc';

let html = fs.readFileSync(htmlFile, 'utf8');
let rsc = fs.readFileSync(rscFile, 'utf8');

// 1. Remove from HTML markup
const targetHtml = '<section class="SingleImage_singleImage__NY3zv" data-margin="default" style="margin-top:2rem;margin-bottom:4rem;"><div class="container"><div class="SingleImage_containedImage__N2jLD" style="position:relative;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 20px 45px -10px rgba(0,0,0,0.1);"><img src="/seven-gate-before-after.png" alt="Before and After Rebrand Logo" style="width:100%;height:auto;display:block;border-radius:24px;" loading="lazy"/></div></div></section>\n';

if (html.includes(targetHtml)) {
  html = html.replace(targetHtml, '');
  console.log('Removed targetHtml from HTML DOM!');
} else {
  console.log('targetHtml not found directly, trying fallback slice');
  const idx = html.indexOf('/seven-gate-before-after.png');
  if (idx !== -1) {
    const start = html.lastIndexOf('<section class="SingleImage_singleImage__NY3zv"', idx);
    const end = html.indexOf('</section>', idx) + '</section>'.length;
    html = html.slice(0, start) + html.slice(end);
    console.log('Sliced out targetHtml from HTML DOM!');
  }
}

// 2. Remove from RSC
const rscIdx = rsc.indexOf('/seven-gate-before-after.png');
if (rscIdx !== -1) {
  const start = rsc.lastIndexOf('["$","section",null,{"className":"SingleImage_singleImage__NY3zv"', rscIdx);
  const end = rsc.indexOf('}]]}],false]}]}],', rscIdx) + '}]]}],false]}]}],'.length;
  console.log('RSC start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    rsc = rsc.slice(0, start) + rsc.slice(end);
    console.log('Removed SingleImage section from RSC!');
  }
}

// 3. Remove from HTML flight data script tags if present
const flightIdx = html.indexOf('/seven-gate-before-after.png');
if (flightIdx !== -1) {
  const start = html.lastIndexOf('[\\\"$\\\",\\\"section\\\",null,{\\\"className\\\":\\\"SingleImage_singleImage__NY3zv\\\"', flightIdx);
  const end = html.indexOf('}]]}],false]}]}],', flightIdx) + '}]]}],false]}]}],'.length;
  console.log('HTML flight start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    html = html.slice(0, start) + html.slice(end);
    console.log('Removed SingleImage from HTML flight scripts!');
  }
}

fs.writeFileSync(htmlFile, html, 'utf8');
fs.writeFileSync(rscFile, rsc, 'utf8');
console.log('Files successfully written!');
