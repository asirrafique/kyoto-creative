const fs = require('fs');

const f = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Find all occurrences of "Green Square" or "UPP"
console.log('Includes Green Square Infra in localize.mjs?', f.includes('Green Square Infra'));
console.log('Includes 88Pilot in localize.mjs?', f.includes('88Pilot') || f.includes('88pilot'));
