const fs = require('fs');

const htmlPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
const rscPath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc';

let html = fs.readFileSync(htmlPath, 'utf8');
let rsc = fs.readFileSync(rscPath, 'utf8');

// Replace services list in Hero if needed:
// user said: "Branding \n Website & App Development \n Brand strategy \n Tone of voice \n Brand identity"
// Existing: "Web design &amp; development" -> let's make sure it matches "Website & App Development" or keep as is.
// Actually let's check:
console.log('Includes Web design &amp; development?', html.includes('Web design &amp; development'));
html = html.replace('Web design &amp; development', 'Website &amp; App Development');
rsc = rsc.replace('Web design & development', 'Website & App Development');

// Bento replacement:
// Put a rich showcase container with the image and/or video loop
// The image uploaded by user is an exact high-res render of Bucher + Suter homepage hero card.
// Let's create a beautiful contained hero card with the image and video fallback or interactive preview.
const targetHtml = '<section class="Bento_bento__pskN5"><div class="container"><div class="Bento_contained__4KAWy"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div></div></section>';

const replacementHtml = `<section class="Bento_bento__pskN5" style="margin-top:2rem;margin-bottom:3rem;"><div class="container"><div class="Bento_contained__4KAWy" style="position:relative;width:100%;border-radius:24px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.15);background:#f6f6f9;"><div style="position:relative;width:100%;aspect-ratio:16/9.5;overflow:hidden;border-radius:24px;"><video src="/Homepage-Hero-Loop.mp4" poster="/seven-gate-hero-preview.png" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;display:block;border-radius:24px;"></video></div></div></div></section>`;

if (html.includes(targetHtml)) {
  html = html.replace(targetHtml, replacementHtml);
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('HTML updated successfully!');
} else {
  console.log('Target not found in HTML!');
}

const targetRsc = '{"src":"https://kota-content.b-cdn.net/app/uploads/2026/06/Homepage-Hero-Loop.mp4"}';
const replacementRsc = '{"src":"/Homepage-Hero-Loop.mp4","poster":"/seven-gate-hero-preview.png"}';

if (rsc.includes(targetRsc)) {
  rsc = rsc.replace(targetRsc, replacementRsc);
  fs.writeFileSync(rscPath, rsc, 'utf8');
  console.log('RSC updated successfully!');
} else {
  console.log('Target not found in RSC!');
}
