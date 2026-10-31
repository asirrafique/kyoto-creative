const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const rsc = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.rsc', 'utf8');

const regex = /https:\/\/kota-content\.b-cdn\.net\/app\/uploads\/[^"'\s\\]+/g;
const matches = [...new Set([...(html.match(regex) || []), ...(rsc.match(regex) || [])])];
console.log('Total asset matches:', matches.length);
console.log(matches.slice(0, 20));
