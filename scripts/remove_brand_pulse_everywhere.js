const fs = require('fs');

let code = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const target = '.Culture_culture__lmpEt + .Partners_partners__jBo8y { display: none !important; }';
const replacement = '.Culture_culture__lmpEt + .Partners_partners__jBo8y, a[href*="/brand-pulse"], [class*="BrandPulseBanner"], .TextImageRows_row__PPlpB:has(a[href*="/brand-pulse"]), .TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]) { display: none !important; }';

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/lib/localize.mjs', code, 'utf8');
  console.log('localize.mjs successfully updated with Brand Pulse removal rules!');
} else {
  console.log('Target not found in localize.mjs');
}

// Also add to the primary global css files in public/__static
const cssFiles = [
  'public/__static/e9ce5a98b142543a/__assets/kota.co.uk/_next/static/css/84191844b30595bc.css'
];

for (const cssFile of cssFiles) {
  if (fs.existsSync(cssFile)) {
    let css = fs.readFileSync(cssFile, 'utf8');
    css += 'a[href*="/brand-pulse"],[class*="BrandPulseBanner"],.TextImageRows_row__PPlpB:has(a[href*="/brand-pulse"]),.TextImageRows_buttonContainer___PqVy:has(a[href*="/brand-pulse"]){display:none!important;}';
    fs.writeFileSync(cssFile, css, 'utf8');
    console.log('Appended rule to', cssFile);
  }
}
