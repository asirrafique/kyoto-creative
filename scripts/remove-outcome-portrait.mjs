import fs from 'fs';

let html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/johnruggieri_project_page.rsc', 'utf8');
let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetHtml = '<div class="johnruggieri-outcome-portrait-wrap"><div class="johnruggieri-outcome-portrait-card"><img src="/images/johnruggieri-portrait.jpg" alt="John Ruggieri" /></div></div>\n';

if (html.includes(targetHtml)) {
  html = html.replace(targetHtml, '');
  console.log('Removed targetHtml from HTML DOM!');
} else {
  const targetHtmlNoNl = '<div class="johnruggieri-outcome-portrait-wrap"><div class="johnruggieri-outcome-portrait-card"><img src="/images/johnruggieri-portrait.jpg" alt="John Ruggieri" /></div></div>';
  if (html.includes(targetHtmlNoNl)) {
    html = html.replace(targetHtmlNoNl, '');
    console.log('Removed targetHtmlNoNl from HTML DOM!');
  }
}

if (rsc.includes(targetHtml)) {
  rsc = rsc.replace(targetHtml, '');
  console.log('Removed targetHtml from RSC!');
} else {
  const targetHtmlNoNl = '<div class="johnruggieri-outcome-portrait-wrap"><div class="johnruggieri-outcome-portrait-card"><img src="/images/johnruggieri-portrait.jpg" alt="John Ruggieri" /></div></div>';
  if (rsc.includes(targetHtmlNoNl)) {
    rsc = rsc.replace(targetHtmlNoNl, '');
    console.log('Removed targetHtmlNoNl from RSC!');
  }
}

// Clean up unused CSS rules in reference.js
const cssToRemove = `      '.johnruggieri-outcome-portrait-wrap {' +
      '  display: flex !important;' +
      '  justify-content: center !important;' +
      '  margin: 3.5rem auto 1.5rem auto !important;' +
      '  width: 100% !important;' +
      '}' +
      '.johnruggieri-outcome-portrait-card {' +
      '  max-width: 520px !important;' +
      '  width: 100% !important;' +
      '  border-radius: 24px !important;' +
      '  overflow: hidden !important;' +
      '  box-shadow: 0 24px 60px -15px rgba(0,0,0,0.18) !important;' +
      '}' +
      '.johnruggieri-outcome-portrait-card img {' +
      '  width: 100% !important;' +
      '  height: auto !important;' +
      '  display: block !important;' +
      '  border-radius: 24px !important;' +
      '}' +
`;

if (ref.includes(cssToRemove)) {
  ref = ref.replace(cssToRemove, '');
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Removed portrait CSS rules from reference.js!');
}

fs.writeFileSync('reference/pages/johnruggieri_project_page.html', html, 'utf8');
fs.writeFileSync('reference/pages/johnruggieri_project_page.rsc', rsc, 'utf8');
console.log('HTML and RSC written successfully!');
