const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');

const sIdx = ref.indexOf('ContactDetails_addresses__lHCN1');
console.log('sIdx:', sIdx);
if (sIdx !== -1) {
  // Let's find line number and line text
  const before = ref.slice(0, sIdx);
  const lineNum = before.split('\n').length - 1;
  const line = ref.split('\n')[lineNum];
  console.log('lineNum:', lineNum);
  console.log('line starts with:', line.slice(0, 50));
}
