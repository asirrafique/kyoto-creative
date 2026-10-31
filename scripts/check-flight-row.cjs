const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');

const s2 = 75532;
// Find the start of the line or row containing s2
const lineStart = ref.lastIndexOf('\n', s2) + 1;
const lineEnd = ref.indexOf('\n', s2);
const row = ref.slice(lineStart, lineEnd !== -1 ? lineEnd : ref.length);
console.log('Row length:', row.length);
console.log('Row starts with:', row.slice(0, 30));
console.log('Row prefix match:', row.match(/^(\d+:)/));
