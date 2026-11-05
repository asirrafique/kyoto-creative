const fs = require('fs');

// 1. Update CSS bundle
const cssPath = 'public/__static/7113233e48e763ff/__assets/kota.co.uk/_next/static/css/84191844b30595bc.css';
let css = fs.readFileSync(cssPath, 'utf8');
const targetRule = '.Articles_articlesList__CXW8a{';
const replacementRule = '.Articles_articlesList__CXW8a > :nth-child(n+4){display:none!important;}.Articles_articlesList__CXW8a{';

if (css.includes(targetRule)) {
  css = css.replace(targetRule, replacementRule);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('CSS file updated to hide items after the 3rd blog in Latest articles!');
} else {
  console.log('Target rule not found in CSS file.');
}

// 2. Update localize.mjs to inject rule into <head> across responses
let localizeCode = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const locTarget = '.LargeCta_mainText__6MrpN { display: none !important; }';
const locReplacement = '.LargeCta_mainText__6MrpN { display: none !important; } .Articles_articlesList__CXW8a > :nth-child(n+4), .Articles_articlesList__CXW8a > a:nth-of-type(n+4) { display: none !important; }';

if (localizeCode.includes(locTarget)) {
  localizeCode = localizeCode.replace(locTarget, locReplacement);
  fs.writeFileSync('src/lib/localize.mjs', localizeCode, 'utf8');
  console.log('localize.mjs successfully updated with 3-blog rule!');
} else {
  console.log('Target not found in localize.mjs');
}
