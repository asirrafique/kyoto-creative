const fs = require('fs');

// 1. Update CSS bundle
const cssPath = 'public/__static/7113233e48e763ff/__assets/kota.co.uk/_next/static/css/84191844b30595bc.css';
let css = fs.readFileSync(cssPath, 'utf8');
const targetRule = '.RelatedPosts_relatedPosts__xfLkb{';
const replacementRule = '.RelatedPosts_relatedPosts__xfLkb .AnimatedGrid_grid__otAMD .container > :nth-child(n+4){display:none!important;}.RelatedPosts_relatedPosts__xfLkb{';

if (css.includes(targetRule)) {
  css = css.replace(targetRule, replacementRule);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('CSS file updated to limit Related articles to 3!');
} else {
  console.log('Target rule not found in CSS file.');
}

// 2. Update localize.mjs to ensure head style injection carries the rule on all pages
let localizeCode = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const locTarget = '.Articles_articlesList__CXW8a > :nth-child(n+4), .Articles_articlesList__CXW8a > a:nth-of-type(n+4) { display: none !important; }';
const locReplacement = '.Articles_articlesList__CXW8a > :nth-child(n+4), .Articles_articlesList__CXW8a > a:nth-of-type(n+4), .RelatedPosts_relatedPosts__xfLkb .AnimatedGrid_grid__otAMD .container > :nth-child(n+4), .RelatedPosts_relatedPosts__xfLkb .AnimatedGrid_grid__otAMD .container > a:nth-of-type(n+4) { display: none !important; }';

if (localizeCode.includes(locTarget)) {
  localizeCode = localizeCode.replace(locTarget, locReplacement);
  fs.writeFileSync('src/lib/localize.mjs', localizeCode, 'utf8');
  console.log('localize.mjs successfully updated with Related articles 3-item rule!');
} else {
  console.log('Target not found in localize.mjs');
}
