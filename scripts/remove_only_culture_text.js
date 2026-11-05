const fs = require('fs');

const htmlFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html';
const rscFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.rsc';

// 1. In RSC:
// Replace:
// children:[["$","$1c",null,{"fallback":null,"children":["$","$L1d",null,{"reason":"next/dynamic","children":"$L25"}]}],["$","div",null,{"className":"container","children":[["$","p",null,{"className":"Culture_text__tkIGz","children":["$","$L19",null,{"children":["$","span",null,{"dangerouslySetInnerHTML":{"__html":"<em>Our culture</em> is core to everything we do."}}]}]}],["$","div",null,{"className":"Culture_buttonContainer__YAvTa","children":["$","$L10",null,{"text":"Find out more","type":"a-internal","href":"culture"}]}]]}]]
// With just the dynamic Matter component:
// children:["$","$1c",null,{"fallback":null,"children":["$","$L1d",null,{"reason":"next/dynamic","children":"$L25"}]}]

let rsc = fs.readFileSync(rscFile, 'utf8');
const pRsc = rsc.indexOf('Culture_culture__lmpEt');
if (pRsc !== -1) {
  const containerMatch = rsc.indexOf(',[\"$\",\"div\",null,{\"className\":\"container\"', pRsc);
  if (containerMatch !== -1) {
    const endMatch = rsc.indexOf(']]}', containerMatch) + 3;
    const toRemove = rsc.substring(containerMatch, endMatch);
    console.log('RSC toRemove:', toRemove);
    // Also change children:[["$","$1c" to children:["$","$1c"
    // and children":"$L25"}]}], to children":"$L25"}]}]
    const childrenDoubleBracket = '{"className":"Culture_culture__lmpEt","children":[[';
    if (rsc.includes(childrenDoubleBracket)) {
      rsc = rsc.replace(childrenDoubleBracket, '{"className":"Culture_culture__lmpEt","children":[');
      rsc = rsc.replace(toRemove, ']');
      fs.writeFileSync(rscFile, rsc, 'utf8');
      console.log('RSC updated successfully!');
    }
  }
}

// 2. In HTML:
let html = fs.readFileSync(htmlFile, 'utf8');

// 2a. Static HTML DOM: Remove <div class="container">...</div> inside <section class="Culture_culture__lmpEt">
const pHtml = html.indexOf('Culture_culture__lmpEt');
if (pHtml !== -1) {
  const cDiv = html.indexOf('<div class="container">', pHtml);
  const endSection = html.indexOf('</section>', pHtml);
  if (cDiv !== -1 && cDiv < endSection) {
    const toRemoveHtml = html.substring(cDiv, endSection);
    html = html.replace(toRemoveHtml, '');
    console.log('HTML DOM container removed!');
  }
}

// 2b. Embedded Flight in HTML script:
const pFlight = html.lastIndexOf('Culture_culture__lmpEt');
if (pFlight !== -1) {
  const containerFlightMatch = html.indexOf(',[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"container\\\"', pFlight);
  if (containerFlightMatch !== -1) {
    const endFlightMatch = html.indexOf(']]}', containerFlightMatch) + 3;
    const toRemoveFlight = html.substring(containerFlightMatch, endFlightMatch);
    console.log('Flight toRemove found, length:', toRemoveFlight.length);
    const flightChildrenDoubleBracket = '{\\\"className\\\":\\\"Culture_culture__lmpEt\\\",\\\"children\\\":[[';
    if (html.includes(flightChildrenDoubleBracket)) {
      html = html.replace(flightChildrenDoubleBracket, '{\\\"className\\\":\\\"Culture_culture__lmpEt\\\",\\\"children\\\":[');
      html = html.replace(toRemoveFlight, ']');
      console.log('HTML flight updated successfully!');
    }
  }
}

fs.writeFileSync(htmlFile, html, 'utf8');
console.log('HTML file written successfully!');
