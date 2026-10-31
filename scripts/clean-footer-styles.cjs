const fs = require('fs');

let content = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Switch footer logo to white logo for contrast against dark background
content = content.replace(
  'const kyotoFooterSvgHtml = \'<image href="/images/kyoto-creative-logo.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image>\';',
  'const kyotoFooterSvgHtml = \'<image href="/images/kyoto-creative-footer-white.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image>\';'
);
content = content.replace(
  'const kyotoFooterSvgRsc = \'["$","image",null,{"href":"/images/kyoto-creative-logo.png","width":618,"height":237,"preserveAspectRatio":"xMidYMid meet"}]\';',
  'const kyotoFooterSvgRsc = \'["$","image",null,{"href":"/images/kyoto-creative-footer-white.png","width":618,"height":237,"preserveAspectRatio":"xMidYMid meet"}]\';'
);

// Target line to delete:
const idx = content.indexOf('.Footer_footer__pQtti, .Footer_footer__pQtti a');
const endIdx = content.indexOf('.Hero_introText__wboFn');

if (idx !== -1 && endIdx !== -1) {
  content = content.slice(0, idx) + content.slice(endIdx);
  fs.writeFileSync('src/lib/localize.mjs', content, 'utf8');
  console.log('Successfully removed dark footer override text styling!');
} else {
  console.error('Indices not found!', idx, endIdx);
}
