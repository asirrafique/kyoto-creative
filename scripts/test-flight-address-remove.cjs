const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');

function removeAddressesFlightNode(node) {
  if (Array.isArray(node)) {
    // Check if node contains the addresses element
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('ContactDetails_addresses__')) {
        console.log('Found ContactDetails_addresses in array at index', i);
        // Replace with null or empty fragment
        node.splice(i, 1);
        return true;
      }
      if (removeAddressesFlightNode(child)) return true;
    }
  } else if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      if (removeAddressesFlightNode(node[key])) return true;
    }
  }
  return false;
}

const lines = ref.split('\n');
for (const line of lines) {
  const m = line.match(/^(\d+:)/);
  if (m && line.includes('ContactDetails_addresses__lHCN1')) {
    console.log('Testing on line prefix:', m[1]);
    const doc = JSON.parse(line.slice(m[1].length));
    const removed = removeAddressesFlightNode(doc);
    console.log('Addresses removed from Flight tree:', removed);
    console.log('Resulting doc still contains addresses?:', JSON.stringify(doc).includes('ContactDetails_addresses__lHCN1'));
  }
}
