const fs = require('fs');

let html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/johnruggieri_project_page.rsc', 'utf8');

// 1. Remove from DOM
const pDomStart = html.indexOf('Cinematic storytelling through WebGL');
const secDomStart = html.lastIndexOf('<section', pDomStart);

const pDomOutcome = html.indexOf('The Outcome');
const secDomOutcome = html.lastIndexOf('<section', pDomOutcome);

console.log('DOM removal:', secDomStart, 'to', secDomOutcome);
html = html.substring(0, secDomStart) + html.substring(secDomOutcome);

// 2. Remove from Flight
const pFlightStart = html.indexOf('Cinematic storytelling through WebGL', 50000);
const tFlightStart = html.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', pFlightStart);
const needle = '[\\"$\\"';
const bracketFlightStart = html.lastIndexOf(needle, tFlightStart);

const p30Ref = html.indexOf(String.raw`$30`, 80000);
const tFlightOutcome = html.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', p30Ref);
const bracketFlightOutcome = html.lastIndexOf(needle, tFlightOutcome);

console.log('Flight removal:', bracketFlightStart, 'to', bracketFlightOutcome);
html = html.substring(0, bracketFlightStart) + html.substring(bracketFlightOutcome);

// 3. Remove from RSC
const pRscStart = rsc.indexOf('Cinematic storytelling through WebGL');
const tRscStart = rsc.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', pRscStart);
const bracketRscStart = rsc.lastIndexOf('["$",', tRscStart);

const p22Ref = rsc.indexOf('"$22"');
const tRscOutcome = rsc.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', p22Ref);
const bracketRscOutcome = rsc.lastIndexOf('["$",', tRscOutcome);

console.log('RSC removal:', bracketRscStart, 'to', bracketRscOutcome);
rsc = rsc.substring(0, bracketRscStart) + rsc.substring(bracketRscOutcome);

// Write and synchronize
fs.writeFileSync('reference/pages/johnruggieri_project_page.html', html, 'utf8');
fs.writeFileSync('reference/pages/johnruggieri_project_page.rsc', rsc, 'utf8');

fs.copyFileSync('reference/pages/johnruggieri_project_page.html', 'reference/pages/9eea07ec11272a46bbea0e2d725f77b57d8205040058906cf4a41a3df5905f4b.html');
fs.copyFileSync('reference/pages/johnruggieri_project_page.rsc', 'reference/pages/9eea07ec11272a46bbea0e2d725f77b57d8205040058906cf4a41a3df5905f4b.rsc');

console.log('Successfully removed range and synchronized files!');
