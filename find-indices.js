const fs = require('fs');
let html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');

const pRef = html.indexOf(String.raw`$30`, 80000);
console.log('pRef:', pRef);
console.log(JSON.stringify(html.slice(pRef - 40, pRef + 40)));

const tFlightOutcome = html.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', pRef);
console.log('tFlightOutcome:', tFlightOutcome);
const needle = '[\\"$\\"';
const bracketFlightOutcome = html.lastIndexOf(needle, tFlightOutcome);
console.log('bracketFlightOutcome:', bracketFlightOutcome);
console.log(JSON.stringify(html.slice(bracketFlightOutcome - 5, bracketFlightOutcome + 40)));
