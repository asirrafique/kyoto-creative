const fs = require('fs');

const htmlFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html';
const rscFile = 'reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.rsc';

// 1. Process RSC
let rsc = fs.readFileSync(rscFile, 'utf8');
const pRsc = rsc.indexOf('Culture_culture__lmpEt');
if (pRsc !== -1) {
  const startRsc = rsc.lastIndexOf(',[', pRsc);
  const nextSectionRsc = rsc.indexOf('Partners_partners__jBo8y', pRsc);
  const endRsc = rsc.lastIndexOf(',[', nextSectionRsc);
  const rscTarget = rsc.substring(startRsc, endRsc);
  console.log('RSC target found, length:', rscTarget.length);
  rsc = rsc.replace(rscTarget, '');
  fs.writeFileSync(rscFile, rsc, 'utf8');
  console.log('RSC file updated successfully!');
} else {
  console.log('RSC Culture section already removed.');
}

// 2. Process HTML
let html = fs.readFileSync(htmlFile, 'utf8');

// 2a. Static HTML DOM section
const pHtml = html.indexOf('Culture_culture__lmpEt');
if (pHtml !== -1 && html.indexOf('<section', pHtml - 100) !== -1) {
  const startHtml = html.lastIndexOf('<section', pHtml);
  const endHtml = html.indexOf('</section>', pHtml) + '</section>'.length;
  const htmlTarget = html.substring(startHtml, endHtml);
  console.log('HTML DOM target found, length:', htmlTarget.length);
  html = html.replace(htmlTarget, '');
}

// 2b. Embedded Flight in HTML script
const pFlight = html.lastIndexOf('Culture_culture__lmpEt');
if (pFlight !== -1) {
  const startFlight = html.lastIndexOf(',[', pFlight);
  const nextSectionFlight = html.indexOf('Partners_partners__jBo8y', pFlight);
  const endFlight = html.lastIndexOf(',[', nextSectionFlight);
  const flightTarget = html.substring(startFlight, endFlight);
  console.log('HTML flight target found, length:', flightTarget.length);
  html = html.replace(flightTarget, '');
}

fs.writeFileSync(htmlFile, html, 'utf8');
console.log('HTML file updated successfully!');
