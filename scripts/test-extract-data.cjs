const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');
const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/gs)];
let rawData = null;
for (const m of matches) {
  if (m[1].includes('$L2e')) {
    rawData = JSON.parse('"' + m[1] + '"');
    break;
  }
}

const ePrefix = '["$","$L2e",null,{"projects":';
const eIdx = rawData.indexOf(ePrefix);
console.log('eIdx:', eIdx);
const sub = rawData.slice(eIdx + ePrefix.length);
console.log('Prefix of sub:', sub.slice(0, 50));

let depth = 0;
let end = 0;
for (let i = 0; i < sub.length; i++) {
  if (sub[i] === '[') depth++;
  else if (sub[i] === ']') {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}

const json = sub.slice(0, end);
console.log('Parsed json length:', json.length);
const projects = JSON.parse(json);
console.log('Total projects count:', projects.length);
console.log('Project 0:', projects[0].node.title, projects[0].node.slug);
console.log('Project 1:', projects[1].node.title, projects[1].node.slug);

// Let's also check sectors and services
const dPrefix = '["$","$L2d",null,';
const dIdx = rawData.indexOf(dPrefix);
const subD = rawData.slice(dIdx + dPrefix.length);
let depthD = 0;
let endD = 0;
for (let i = 0; i < subD.length; i++) {
  if (subD[i] === '{') depthD++;
  else if (subD[i] === '}') {
    depthD--;
    if (depthD === 0) {
      endD = i + 1;
      break;
    }
  }
}
const filters = JSON.parse(subD.slice(0, endD));
console.log('Filters sectors count:', filters.sectors.length);
console.log('Filters services count:', filters.services.length);
