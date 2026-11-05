const fs = require('fs');

const htmlFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html';
const rscFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.rsc';

const oldTextRaw = 'The brands we partner with are looking to push their industry boundaries, and ready to invest quality resources into their digital. They want to work with a close, more specialist team they click with – and who they trust to take them outside of their creative comfort zone.';
const newTextRaw = 'We help businesses grow with sharp marketing & branding.high-converting websites & apps, and practical AI automations that save time and drive results.';
const newTextHtmlEscaped = 'We help businesses grow with sharp marketing &amp; branding.high-converting websites &amp; apps, and practical AI automations that save time and drive results.';

// 1. Update RSC
let rsc = fs.readFileSync(rscFile, 'utf8');
const oldRscSnippet = '<p>The brands we partner with are looking to push their industry boundaries, and ready to invest quality resources into their digital. They want to work with a close, more specialist team they click with – and who they trust to take them outside of their creative comfort zone.</p>\\n';
const newRscSnippet = `<p>${newTextRaw}</p>\\n`;

console.log('RSC contains old snippet?', rsc.includes(oldRscSnippet));
if (rsc.includes(oldRscSnippet)) {
  rsc = rsc.replace(oldRscSnippet, newRscSnippet);
  fs.writeFileSync(rscFile, rsc, 'utf8');
  console.log('RSC updated successfully!');
}

// 2. Update HTML
let html = fs.readFileSync(htmlFile, 'utf8');

// 2a. DOM representation
const oldDomSnippet = '<p>The brands we partner with are looking to push their industry boundaries, and ready to invest quality resources into their digital. They want to work with a close, more specialist team they click with – and who they trust to take them outside of their creative comfort zone.</p>';
const newDomSnippet = `<p>${newTextHtmlEscaped}</p>`;

console.log('HTML contains old DOM snippet?', html.includes(oldDomSnippet));
if (html.includes(oldDomSnippet)) {
  html = html.replace(oldDomSnippet, newDomSnippet);
  console.log('HTML DOM updated successfully!');
}

// 2b. Flight representation inside script
const oldFlightSnippet = '\\u003cp\\u003eThe brands we partner with are looking to push their industry boundaries, and ready to invest quality resources into their digital. They want to work with a close, more specialist team they click with – and who they trust to take them outside of their creative comfort zone.\\u003c/p\\u003e\\\\n';
const newFlightSnippet = `\\u003cp\\u003e${newTextRaw}\\u003c/p\\u003e\\\\n`;

console.log('HTML contains old Flight snippet?', html.includes(oldFlightSnippet));
if (html.includes(oldFlightSnippet)) {
  html = html.replace(oldFlightSnippet, newFlightSnippet);
  console.log('HTML Flight updated successfully!');
}

fs.writeFileSync(htmlFile, html, 'utf8');
console.log('All updates written to reference files.');
