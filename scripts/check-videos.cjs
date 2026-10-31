const fs = require('fs');

const pGreen = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

// Find all video tags and their data attributes
const vMatches = [...pGreen.matchAll(/<video\b([^>]*)>/g)];
console.log('Total video tags:', vMatches.length);
vMatches.forEach((m, idx) => {
  console.log(`Video ${idx}:`, m[1]);
});
