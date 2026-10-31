const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');
const p = 86307;
const s = ref.lastIndexOf('"$L', p);
console.log('Reference in contact page:', ref.slice(s - 10, s + 30));
