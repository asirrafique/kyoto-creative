import fs from 'fs';

let html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/johnruggieri_project_page.rsc', 'utf8');

// 1. Remove from HTML DOM markup
const htmlTarget = '<section data-margin="default"><div><section class="Video_video__2erdW"><div class="ImageEnter_image__FSEP_" data-fill="false"><div class="Video_videoContainer__21JKT"><div class="Video_loopVideo__1G4By"><span class="AutoplayVideo_video__zckWy AutoplayVideo_fill__ZPgCR"><video src="/images/johnruggieri-artwork.jpg" autoPlay="" loop="" muted="" playsInline=""></video></span></div></div></div></section></div></section>';

if (html.includes(htmlTarget)) {
  html = html.replace(htmlTarget, '');
  console.log('Removed artwork section from HTML DOM!');
} else {
  console.log('htmlTarget not found directly, slicing by /images/johnruggieri-artwork.jpg');
  const idx = html.indexOf('/images/johnruggieri-artwork.jpg');
  if (idx !== -1) {
    const start = html.lastIndexOf('<section data-margin="default">', idx);
    const end = html.indexOf('</section>', idx) + '</section>'.length;
    html = html.slice(0, start) + html.slice(end);
    console.log('Sliced out artwork section from HTML DOM!');
  }
}

// 2. Remove from RSC
const rscTarget = '["$","section",null,{"className":"$undefined","data-margin":"default","children":[false,["$","div",null,{"className":"$undefined","children":["$","$L2e",null,{"data":{"__typename":"Project_Singleproject_ContentBuilder_SingleVideo","fieldGroupName":"Project_Singleproject_ContentBuilder_SingleVideo","alignment":"fullPageWidth","marginBottom":"default","loop":{"mediaItemUrl":"/images/johnruggieri-artwork.jpg"},"fullVideo":null}}]}]]}],';

if (rsc.includes(rscTarget)) {
  rsc = rsc.replace(rscTarget, '');
  console.log('Removed artwork node from RSC!');
} else {
  console.log('rscTarget not found directly in RSC');
}

// 3. Remove from HTML embedded Flight script
const flightTarget = '[\\"$\\",\\"section\\",null,{\\"className\\":\\"$undefined\\",\\"data-margin\\":\\"default\\",\\"children\\":[false,[\\"$\\",\\"div\\",null,{\\"className\\":\\"$undefined\\",\\"children\\":[\\"$\\",\\"$L2e\\",null,{\\"data\\":{\\"__typename\\":\\"Project_Singleproject_ContentBuilder_SingleVideo\\",\\"fieldGroupName\\":\\"Project_Singleproject_ContentBuilder_SingleVideo\\",\\"alignment\\":\\"fullPageWidth\\",\\"marginBottom\\":\\"default\\",\\"loop\\":{\\"mediaItemUrl\\":\\"/images/johnruggieri-artwork.jpg\\"},\\"fullVideo\\":null}}]}]]}],';

if (html.includes(flightTarget)) {
  html = html.replace(flightTarget, '');
  console.log('Removed artwork node from HTML flight script!');
} else {
  console.log('flightTarget not found directly in HTML');
}

fs.writeFileSync('reference/pages/johnruggieri_project_page.html', html, 'utf8');
fs.writeFileSync('reference/pages/johnruggieri_project_page.rsc', rsc, 'utf8');
console.log('HTML and RSC files written successfully!');
