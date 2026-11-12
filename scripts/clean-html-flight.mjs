import fs from 'fs';

let html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const targetInHtml = '["$","section",null,{"className":"$undefined","data-margin":"default","children":[false,["$","div",null,{"className":"$undefined","children":["$","$L2e",null,{"data":{"__typename":"Project_Singleproject_ContentBuilder_SingleVideo","fieldGroupName":"Project_Singleproject_ContentBuilder_SingleVideo","alignment":"fullPageWidth","marginBottom":"default","loop":{"mediaItemUrl":"https://kota-content.b-cdn.net/app/uploads/2025/04/All-Pages-3D-2.mp4"},"fullVideo":null}}]}]]}],';

console.log('HTML contains target:', html.includes(targetInHtml));
if (html.includes(targetInHtml)) {
  html = html.replace(targetInHtml, '');
  fs.writeFileSync('reference/pages/green_square_infra_project_page.html', html, 'utf8');
  console.log('Removed from HTML embedded flight data successfully!');
}
