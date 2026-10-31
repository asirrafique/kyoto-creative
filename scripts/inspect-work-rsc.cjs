const fs = require('fs');

const rsc = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.rsc', 'utf8');

// Find all lines in RSC
const lines = rsc.split('\n');
console.log('Total RSC lines:', lines.length);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING') || line.includes('Work_projectsWithFilters')) {
    console.log(`Line ${i}:`, line.slice(0, 300));
  }
}
