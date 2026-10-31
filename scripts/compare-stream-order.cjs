const fs = require('fs');

const gs = fs.readFileSync('scripts/gsFlight.txt', 'utf8');
const pilot = fs.readFileSync('scripts/pilotFlight.txt', 'utf8');

function getOrder(str) {
  const ids = [];
  const lines = str.split('\n');
  for (const line of lines) {
    const m = line.match(/^([0-9a-f]+):/);
    if (m) ids.push(m[1]);
  }
  return ids;
}

const gsOrder = getOrder(gs);
const pilotOrder = getOrder(pilot);

console.log('GS order:', gsOrder.join(', '));
console.log('Pilot order:', pilotOrder.join(', '));

// Compare order diff
gsOrder.forEach((id, idx) => {
  if (pilotOrder[idx] !== id) {
    console.log(`Order mismatch at index ${idx}: GS=${id}, Pilot=${pilotOrder[idx]}`);
  }
});
