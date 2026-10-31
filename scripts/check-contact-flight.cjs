const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');
const lines = ref.split('\n');
console.log('Lines count:', lines.length);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('ContactDetails_addresses__lHCN1')) {
    console.log(`Line ${i}: startsWith=${lines[i].slice(0, 30)} endsWith=${lines[i].slice(-30)}`);
  }
}
