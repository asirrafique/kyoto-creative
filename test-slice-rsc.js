const fs = require('fs');
const rsc = fs.readFileSync('reference/pages/johnruggieri_project_page.rsc', 'utf8');

const pStart = rsc.indexOf('Cinematic storytelling through WebGL');
const tStart = rsc.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', pStart);

const p22 = 72610;
const tOutcome = rsc.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', p22);

const bracketStart = rsc.lastIndexOf('["$', tStart);
const bracketOutcome = rsc.lastIndexOf('["$', tOutcome);

console.log('bracketStart:', bracketStart, 'bracketOutcome:', bracketOutcome);
console.log('starts with:', JSON.stringify(rsc.slice(bracketStart, bracketStart + 50)));
console.log('ends with:', JSON.stringify(rsc.slice(bracketOutcome - 50, bracketOutcome)));
