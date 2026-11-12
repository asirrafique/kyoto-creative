import fs from 'fs';

let html = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/88pilot_project_page.rsc', 'utf8');

// 1. Clean RSC
const rscIdx = rsc.indexOf('RelatedProjects_relatedProjects__opNhl');
if (rscIdx !== -1) {
  const start = rsc.lastIndexOf(',["$","section",null,{"className":"RelatedProjects_relatedProjects__opNhl"', rscIdx);
  const end = rsc.indexOf(',"$L26"]', rscIdx);
  console.log('rsc start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    rsc = rsc.slice(0, start) + rsc.slice(end);
    fs.writeFileSync('reference/pages/88pilot_project_page.rsc', rsc, 'utf8');
    console.log('Successfully cleaned RelatedProjects from RSC!');
  }
}

// 2. Clean HTML Flight
const flightIdx = html.indexOf('RelatedProjects_relatedProjects__opNhl');
if (flightIdx !== -1) {
  const start = html.lastIndexOf(',[\\\"$\\\",\\\"section\\\",null,{\\\"className\\\":\\\"RelatedProjects_relatedProjects__opNhl\\\"', flightIdx);
  const end = html.indexOf(',\\\"$L34\\\"]', flightIdx);
  console.log('flight start:', start, 'end:', end);
  if (start !== -1 && end !== -1) {
    html = html.slice(0, start) + html.slice(end);
    fs.writeFileSync('reference/pages/88pilot_project_page.html', html, 'utf8');
    console.log('Successfully cleaned RelatedProjects from HTML flight script!');
  }
}
