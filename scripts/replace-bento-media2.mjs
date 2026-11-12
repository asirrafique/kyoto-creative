import fs from 'fs';

let html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/johnruggieri_project_page.rsc', 'utf8');

// Replace Bento-Right2 video in HTML
const htmlVideoTarget = '<video src="https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4" autoPlay="" loop="" muted="" playsInline=""></video>';
const htmlVideoReplace = '<img src="/images/johnruggieri-bento-signature.jpg" alt="John Ruggieri Signature" style="width:100%;height:100%;object-fit:cover;border-radius:20px;display:block;" />';

if (html.includes(htmlVideoTarget)) {
  html = html.replace(htmlVideoTarget, htmlVideoReplace);
  console.log('Replaced Bento_media2 video in HTML markup!');
}

// Replace in RSC
const rscTarget = '{"className":"Bento_media2__Z_9Z_","data-animation":"grid-item","children":[false,["$","$L2d",null,{"src":"https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4"}]]}';
const rscReplace = '{"className":"Bento_media2__Z_9Z_","data-animation":"grid-item","children":[false,["$","img",null,{"src":"/images/johnruggieri-bento-signature.jpg","alt":"John Ruggieri Signature","style":{"width":"100%","height":"100%","objectFit":"cover","borderRadius":"20px","display":"block"}}]]}';

if (rsc.includes(rscTarget)) {
  rsc = rsc.replace(rscTarget, rscReplace);
  console.log('Replaced Bento_media2 video in RSC!');
}

// Replace in HTML embedded Flight script
const htmlFlightTarget = '{\\"className\\":\\"Bento_media2__Z_9Z_\\",\\"data-animation\\":\\"grid-item\\",\\"children\\":[false,[\\"$\\",\\"$L2d\\",null,{\\"src\\":\\"https://kota-content.b-cdn.net/app/uploads/2025/04/Bento-Right2.mp4\\"}]]}';
const htmlFlightReplace = '{\\"className\\":\\"Bento_media2__Z_9Z_\\",\\"data-animation\\":\\"grid-item\\",\\"children\\":[false,[\\"$\\",\\"img\\",null,{\\"src\\":\\"/images/johnruggieri-bento-signature.jpg\\",\\"alt\\":\\"John Ruggieri Signature\\",\\"style\\":{\\"width\\":\\"100%\\",\\"height\\":\\"100%\\",\\"objectFit\\":\\"cover\\",\\"borderRadius\\":\\"20px\\",\\"display\\":\\"block\\"}}]]}';

if (html.includes(htmlFlightTarget)) {
  html = html.replace(htmlFlightTarget, htmlFlightReplace);
  console.log('Replaced Bento_media2 in HTML flight script!');
}

fs.writeFileSync('reference/pages/johnruggieri_project_page.html', html, 'utf8');
fs.writeFileSync('reference/pages/johnruggieri_project_page.rsc', rsc, 'utf8');
console.log('HTML and RSC written successfully for Bento_media2!');
