const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');
const pattern = /<div class="ContactDetails_addresses__[^"]*"[\s\S]*?<\/div>\s*<\/div>/;
const match = ref.match(pattern);
console.log('Match found:', Boolean(match));
if (match) {
  console.log('Matched text:\n', match[0]);
}
