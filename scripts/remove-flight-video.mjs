import fs from 'fs';

let html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const targetStart = '["$","section",null,{"className":"$undefined","data-margin":"default","children":[false,["$","div",null,{"className":"$undefined","children":["$","$L2e",null,{"data":{"__typename":"Project_Singleproject_ContentBuilder_SingleVideo"';

const idx = html.indexOf('All-Pages-3D-2');
if (idx !== -1) {
  const start = html.lastIndexOf('[\\\"$\\\",\\\"section\\\",null,{\\\"className\\\":\\\"$undefined\\\",\\\"data-margin\\\":\\\"default\\\"', idx);
  const end = html.indexOf('}]]}],', idx) + '}]]}],'.length;
  console.log('start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    console.log('Slice to remove:', html.slice(start, end));
    html = html.slice(0, start) + html.slice(end);
    fs.writeFileSync('reference/pages/green_square_infra_project_page.html', html, 'utf8');
    console.log('Successfully removed flight video node from HTML!');
  }
}
