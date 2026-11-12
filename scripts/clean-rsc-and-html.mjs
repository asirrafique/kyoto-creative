import fs from 'fs';

let html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/green_square_infra_project_page.rsc', 'utf8');

const targetRsc = '["$","section",null,{"className":"$undefined","data-margin":"default","children":[false,["$","div",null,{"className":"$undefined","children":["$","$L20",null,{"data":{"__typename":"Project_Singleproject_ContentBuilder_SingleVideo","fieldGroupName":"Project_Singleproject_ContentBuilder_SingleVideo","alignment":"fullPageWidth","marginBottom":"default","loop":{"mediaItemUrl":"https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4"},"fullVideo":null}}]}]]}],';

console.log('RSC contains target:', rsc.includes(targetRsc));
if (rsc.includes(targetRsc)) {
  rsc = rsc.replace(targetRsc, '');
  fs.writeFileSync('reference/pages/green_square_infra_project_page.rsc', rsc, 'utf8');
  console.log('Removed video node from RSC successfully!');
}

// Check in HTML embedded flight data
const flightTarget = '{\\"__typename\\":\\"Project_Singleproject_ContentBuilder_SingleVideo\\",\\"fieldGroupName\\":\\"Project_Singleproject_ContentBuilder_SingleVideo\\",\\"alignment\\":\\"fullPageWidth\\",\\"marginBottom\\":\\"default\\",\\"loop\\":{\\"mediaItemUrl\\":\\"https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4\\"},\\"fullVideo\\":null}';

const fullHtmlFlightTarget = '["$","section",null,{"className":"$undefined","data-margin":"default","children":[false,["$","div",null,{"className":"$undefined","children":["$","$L20",null,{"data":{"__typename":"Project_Singleproject_ContentBuilder_SingleVideo","fieldGroupName":"Project_Singleproject_ContentBuilder_SingleVideo","alignment":"fullPageWidth","marginBottom":"default","loop":{"mediaItemUrl":"https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4"},"fullVideo":null}}]}]]}],';

// In HTML script tag, quotes are escaped as \"
const htmlEscapedTarget = '[\\"$\\",\\"section\\",null,{\\"className\\":\\"$undefined\\",\\"data-margin\\":\\"default\\",\\"children\\":[false,[\\"$\\",\\"div\\",null,{\\"className\\":\\"$undefined\\",\\"children\\":[\\"$\\",\\"$L20\\",null,{\\"data\\":{\\"__typename\\":\\"Project_Singleproject_ContentBuilder_SingleVideo\\",\\"fieldGroupName\\":\\"Project_Singleproject_ContentBuilder_SingleVideo\\",\\"alignment\\":\\"fullPageWidth\\",\\"marginBottom\\":\\"default\\",\\"loop\\":{\\"mediaItemUrl\\":\\"https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4\\"},\\"fullVideo\\":null}}]}]]}],';

console.log('HTML contains escaped target:', html.includes(htmlEscapedTarget));
if (html.includes(htmlEscapedTarget)) {
  html = html.replace(htmlEscapedTarget, '');
  fs.writeFileSync('reference/pages/green_square_infra_project_page.html', html, 'utf8');
  console.log('Removed video node from HTML script tags successfully!');
}
