const fs = require('fs');

// 1. Update CSS file directly
const cssPath = 'public/__static/7113233e48e763ff/__assets/kota.co.uk/_next/static/css/84191844b30595bc.css';
let css = fs.readFileSync(cssPath, 'utf8');
const targetRule = '.BigUps_partners__xRCBU{';
const replacementRule = '.BigUps_partners__xRCBU{display:none!important;';

if (css.includes(targetRule)) {
  css = css.replace(targetRule, replacementRule);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('CSS file updated with display: none !important for .BigUps_partners__xRCBU');
} else {
  console.log('Target rule not found in CSS file.');
}

// 2. Update localize.mjs to ensure custom style injection also includes it
let localizeCode = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const locTarget = '.Culture_text__tkIGz, .Culture_buttonContainer__YAvTa { display: none !important; }';
const locReplacement = '.Culture_text__tkIGz, .Culture_buttonContainer__YAvTa, .BigUps_partners__xRCBU { display: none !important; }';

if (localizeCode.includes(locTarget)) {
  localizeCode = localizeCode.replace(locTarget, locReplacement);
  fs.writeFileSync('src/lib/localize.mjs', localizeCode, 'utf8');
  console.log('localize.mjs successfully updated with .BigUps_partners__xRCBU hide rule!');
} else {
  console.log('Target not found in localize.mjs');
}
