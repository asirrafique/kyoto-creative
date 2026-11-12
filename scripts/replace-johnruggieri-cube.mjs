import fs from 'fs';

let html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/johnruggieri_project_page.rsc', 'utf8');

// Replace Square-Rotating-Cube2 video in HTML
const htmlVideoTarget = '<video src="https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4" autoPlay="" loop="" muted="" playsInline=""></video>';
const htmlVideoReplace = '<img src="/images/johnruggieri-bento-cube.jpg" alt="John Ruggieri Artwork" style="width:100%;height:100%;object-fit:cover;border-radius:20px;display:block;" />';

if (html.includes(htmlVideoTarget)) {
  html = html.replace(htmlVideoTarget, htmlVideoReplace);
  console.log('Replaced video in HTML markup!');
}

// Replace in RSC
const rscTarget = '{"className":"Bento_media1__Zf6n4","data-animation":"grid-item","children":[false,["$","$L2d",null,{"src":"https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4"}]]}';
const rscReplace = '{"className":"Bento_media1__Zf6n4","data-animation":"grid-item","children":[false,["$","img",null,{"src":"/images/johnruggieri-bento-cube.jpg","alt":"John Ruggieri Artwork","style":{"width":"100%","height":"100%","objectFit":"cover","borderRadius":"20px","display":"block"}}]]}';

if (rsc.includes(rscTarget)) {
  rsc = rsc.replace(rscTarget, rscReplace);
  console.log('Replaced video in RSC!');
}

// Replace in HTML embedded Flight script
const htmlFlightTarget = '{\\"className\\":\\"Bento_media1__Zf6n4\\",\\"data-animation\\":\\"grid-item\\",\\"children\\":[false,[\\"$\\",\\"$L2d\\",null,{\\"src\\":\\"https://kota-content.b-cdn.net/app/uploads/2025/04/Square-Rotating-Cube2.mp4\\"}]]}';
const htmlFlightReplace = '{\\"className\\":\\"Bento_media1__Zf6n4\\",\\"data-animation\\":\\"grid-item\\",\\"children\\":[false,[\\"$\\",\\"img\\",null,{\\"src\\":\\"/images/johnruggieri-bento-cube.jpg\\",\\"alt\\":\\"John Ruggieri Artwork\\",\\"style\\":{\\"width\\":\\"100%\\",\\"height\\":\\"100%\\",\\"objectFit\\":\\"cover\\",\\"borderRadius\\":\\"20px\\",\\"display\\":\\"block\\"}}]]}';

if (html.includes(htmlFlightTarget)) {
  html = html.replace(htmlFlightTarget, htmlFlightReplace);
  console.log('Replaced video in HTML flight script!');
}

fs.writeFileSync('reference/pages/johnruggieri_project_page.html', html, 'utf8');
fs.writeFileSync('reference/pages/johnruggieri_project_page.rsc', rsc, 'utf8');
console.log('HTML and RSC files written successfully!');
