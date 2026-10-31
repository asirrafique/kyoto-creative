const fs = require('fs');
const html = fs.readFileSync('reference/pages/johnruggieri_project_page.html', 'utf8');

const tStart = html.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', html.indexOf('Cinematic storytelling through WebGL', 50000));
const tOutcome = html.lastIndexOf('TextLeftListRight_textLeftListRight__i5dfy', 105448);

const bracketStart = html.lastIndexOf('[\\"', tStart);
const bracketOutcome = html.lastIndexOf('[\\"', tOutcome);

console.log('bracketStart:', bracketStart, 'bracketOutcome:', bracketOutcome);
console.log(JSON.stringify(html.slice(bracketStart - 2, bracketStart + 50)));
console.log(JSON.stringify(html.slice(bracketOutcome - 2, bracketOutcome + 50)));

const removedSlice = html.slice(bracketStart, bracketOutcome);
console.log('starts with:', JSON.stringify(removedSlice.slice(0, 50)));
console.log('ends with:', JSON.stringify(removedSlice.slice(-50)));
