const fs = require('fs');

let f = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const tOld1 = `<p class="Intro_smallHeading__gYXTn">Industry</p><p>SaaS</p></div><div><p class="Intro_smallHeading__gYXTn">Location</p><p>London, UK</p>`;
console.log('Includes tOld1?', f.includes(tOld1));

const tOldFlight = `["$","p",null,{"className":"Intro_smallHeading__gYXTn","children":"Industry"}],["$","p",null,{"children":"SaaS"}]]}],["$","div",null,{"className":"$undefined","children":[["$","p",null,{"className":"Intro_smallHeading__gYXTn","children":"Location"}],["$","p",null,{"children":"London, UK"}]]}`;
console.log('Includes tOldFlight?', f.includes(tOldFlight));
