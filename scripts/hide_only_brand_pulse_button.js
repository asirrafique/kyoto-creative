const fs = require('fs');

// 1. Update localize.mjs:
// Restore the banner / content / row, and only target the button itself:
// .TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]), .Button_button__JJiqJ:has(a[href*="/brand-pulse"]), a.Button_inner__fnyH6[href*="/brand-pulse"]
let localizeCode = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const targetStr = '.Culture_culture__lmpEt + .Partners_partners__jBo8y, a[href*="/brand-pulse"], [class*="BrandPulseBanner"], .TextImageRows_row__PPlpB:has(a[href*="/brand-pulse"]), .TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]) { display: none !important; }';
const newStr = '.Culture_culture__lmpEt + .Partners_partners__jBo8y, .TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]), .Button_button__JJiqJ:has(a[href*="/brand-pulse"]), a.Button_inner__fnyH6[href*="/brand-pulse"] { display: none !important; }';

if (localizeCode.includes(targetStr)) {
  localizeCode = localizeCode.replace(targetStr, newStr);
  fs.writeFileSync('src/lib/localize.mjs', localizeCode, 'utf8');
  console.log('localize.mjs updated: restored the section/banner, hiding ONLY the button!');
} else {
  console.log('Target string not found in localize.mjs');
}

// 2. Update CSS file:
const cssPath = 'public/__static/e9ce5a98b142543a/__assets/kota.co.uk/_next/static/css/84191844b30595bc.css';
let css = fs.readFileSync(cssPath, 'utf8');
const oldCssAppend = 'a[href*="/brand-pulse"],[class*="BrandPulseBanner"],.TextImageRows_row__PPlpB:has(a[href*="/brand-pulse"]),.TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]){display:none!important;}';
const newCssAppend = '.TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]),.Button_button__JJiqJ:has(a[href*="/brand-pulse"]),a.Button_inner__fnyH6[href*="/brand-pulse"]{display:none!important;}';

if (css.includes(oldCssAppend)) {
  css = css.replace(oldCssAppend, newCssAppend);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('CSS file updated: restored the section/banner, hiding ONLY the button!');
} else {
  console.log('Old CSS append not found in 84191844b30595bc.css');
}
