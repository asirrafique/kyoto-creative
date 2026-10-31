const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const target = '<section class="Bento_bento__pskN5"><div class="container"><div class="Bento_contained__4KAWy"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video loop="" muted="" playsInline=""></video></span></div></div></section>';
console.log('Target found in HTML?', html.includes(target));

const rsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');
const rscTarget = '{"className":"Bento_contained__4KAWy","children":[false,["$","$L1f",null,{"src":"https://kota-content.b-cdn.net/app/uploads/2026/06/Homepage-Hero-Loop.mp4"}]]}';
console.log('RSC target found?', rsc.includes(rscTarget));
