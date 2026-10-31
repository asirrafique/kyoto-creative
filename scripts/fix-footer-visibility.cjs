const fs = require('fs');
let content = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// 1. Point footer logo to white logo
content = content.replace(
  'const kyotoFooterSvgHtml = \'<image href="/images/kyoto-creative-logo.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image>\';',
  'const kyotoFooterSvgHtml = \'<image href="/images/kyoto-creative-footer-white.png" width="618" height="237" preserveAspectRatio="xMidYMid meet"></image>\';'
);
content = content.replace(
  'const kyotoFooterSvgRsc = \'["$","image",null,{"href":"/images/kyoto-creative-logo.png","width":618,"height":237,"preserveAspectRatio":"xMidYMid meet"}]\';',
  'const kyotoFooterSvgRsc = \'["$","image",null,{"href":"/images/kyoto-creative-footer-white.png","width":618,"height":237,"preserveAspectRatio":"xMidYMid meet"}]\';'
);

// 2. Remove the forced black colors on the footer
const target = '.Footer_footer__pQtti, .Footer_footer__pQtti a, .Footer_footer__pQtti p, .Footer_footer__pQtti span, .Footer_footer__pQtti li { color: #000 !important; }.Footer_email__nLajh { color: #000 !important; -webkit-text-fill-color: #000 !important; background: none !important; animation: none !important; }.Footer_email__nLajh:hover { color: #222 !important; -webkit-text-fill-color: #222 !important; }.Footer_socialLinks__tA7gt a { color: #000 !important; }.Footer_socialLinks__tA7gt svg path { fill: #000 !important; }.Footer_lastNav__at6Kh a { color: #000 !important; }.Footer_lastNav__at6Kh svg path { fill: #000 !important; }.Footer_newsletterButton__wp2hz { color: #000 !important; border-color: #000 !important; }.Footer_newsletterButton__wp2hz:hover { background-color: #000 !important; color: #fff !important; border-color: #000 !important; }.Footer_sectorTitle__yEZhb { color: #000 !important; }.Footer_sectorItem__0Cx14 { color: #000 !important; border-color: rgba(0,0,0,0.3) !important; }.Footer_sectorItem__0Cx14:hover { border-color: #000 !important; background-color: rgba(0,0,0,0.05) !important; }.Footer_copyright__j4atB, .Footer_copyrightText__f_Lte { color: #000 !important; }.Footer_top__YBhK_ { border-top-color: rgba(0,0,0,0.2) !important; }.CopyText_tooltip__HuxWa { background-color: #000 !important; color: #fff !important; }\' +';

console.log('Includes target?', content.includes(target));
if (content.includes(target)) {
  content = content.replace(target, '');
  fs.writeFileSync('src/lib/localize.mjs', content, 'utf8');
  console.log('Updated localize.mjs successfully!');
} else {
  console.log('Could not find target in localize.mjs');
}
