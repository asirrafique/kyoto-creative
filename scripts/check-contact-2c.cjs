const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');

const p = ref.indexOf('"$L2c"');
console.log('Index of "$L2c":', p);
const pEsc = ref.indexOf('\\"$L2c\\"');
console.log('Index of \\"$L2c\\":', pEsc);
if (pEsc !== -1) {
  console.log(ref.slice(pEsc - 30, pEsc + 40));
}
