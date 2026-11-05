const fs = require('fs');

// 1. Update CSS directly in the bundle
const cssPath = 'public/__static/7113233e48e763ff/__assets/kota.co.uk/_next/static/css/84191844b30595bc.css';
let css = fs.readFileSync(cssPath, 'utf8');
const targetRule = '.LargeCta_mainText__6MrpN{';
const replacementRule = '.LargeCta_mainText__6MrpN{display:none!important;';

if (css.includes(targetRule)) {
  css = css.replace(targetRule, replacementRule);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('CSS file updated with display: none !important for .LargeCta_mainText__6MrpN');
} else {
  console.log('Target rule not found in CSS file.');
}

// 2. Update localize.mjs to ensure custom style injection also includes it
let localizeCode = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const locTarget = '.Culture_text__tkIGz, .Culture_buttonContainer__YAvTa, .BigUps_partners__xRCBU { display: none !important; }';
const locReplacement = '.Culture_text__tkIGz, .Culture_buttonContainer__YAvTa, .BigUps_partners__xRCBU, .LargeCta_mainText__6MrpN { display: none !important; }';

if (localizeCode.includes(locTarget)) {
  localizeCode = localizeCode.replace(locTarget, locReplacement);
  fs.writeFileSync('src/lib/localize.mjs', localizeCode, 'utf8');
  console.log('localize.mjs successfully updated with .LargeCta_mainText__6MrpN hide rule!');
} else {
  console.log('Target not found in localize.mjs');
}

// 3. Also clear the text content inside reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html & .rsc
const targetText = 'We are a Creative Digital Agency based in Clerkenwell London, specialising in Creative Web Design, Web Development, Branding and Digital Marketing.';

const htmlFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html';
let html = fs.readFileSync(htmlFile, 'utf8');
if (html.includes(targetText)) {
  html = html.replaceAll(targetText, '');
  fs.writeFileSync(htmlFile, html, 'utf8');
  console.log('Cleared text from agency HTML');
}

const rscFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.rsc';
let rsc = fs.readFileSync(rscFile, 'utf8');
if (rsc.includes(targetText)) {
  rsc = rsc.replaceAll(targetText, '');
  fs.writeFileSync(rscFile, rsc, 'utf8');
  console.log('Cleared text from agency RSC');
}
