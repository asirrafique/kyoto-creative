const fs = require('fs');

const htmlPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
const rscPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc';

let html = fs.readFileSync(htmlPath, 'utf8');
let rsc = fs.readFileSync(rscPath, 'utf8');

// The image card markup matching site style:
const singleImageHtml = `<section class="SingleImage_singleImage__NY3zv" data-margin="default" style="margin-top:2rem;margin-bottom:4rem;"><div class="container"><div class="SingleImage_containedImage__N2jLD" style="position:relative;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 20px 45px -10px rgba(0,0,0,0.1);"><img src="/seven-gate-before-after.png" alt="Before and After Rebrand Logo" style="width:100%;height:auto;display:block;border-radius:24px;" loading="lazy"/></div></div></section>`;

// In HTML, we insert singleImageHtml right inside ContentBuilder_contentBuilder__FAKQG before Results_results__xMS5p
const targetHtml = '<section class="ContentBuilder_contentBuilder__FAKQG"><section class="Results_results__xMS5p"';
const replacementHtml = '<section class="ContentBuilder_contentBuilder__FAKQG">' + singleImageHtml + '<section class="Results_results__xMS5p"';

if (html.includes(targetHtml)) {
  html = html.replace(targetHtml, replacementHtml);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('HTML updated successfully!');
} else {
  console.error('Target not found in HTML!');
}

// In RSC, let's also update the image src references or add the section
// Let's check where the images point:
rsc = rsc.split('https://kota-content.b-cdn.net/app/uploads/2026/06/BeforeAfter-Logo.png').join('/seven-gate-before-after.png');
rsc = rsc.split('https://kota-content.b-cdn.net/app/uploads/2026/06/BeforeAfter-Logo-2000x1126.png').join('/seven-gate-before-after.png');
fs.writeFileSync(rscPath, rsc, 'utf8');
console.log('RSC updated successfully!');
