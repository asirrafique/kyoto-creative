const fs = require('fs');
const html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const pMatches = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
const pTree = pMatches.find(p => p[1].startsWith('e:'));
const unescaped = JSON.parse('"' + pTree[1] + '"');
const parsed = JSON.parse(unescaped.slice(unescaped.indexOf(':') + 1));

const block0 = parsed[2][3].children[3][3].children[0];
console.log('Block 0:');
console.log(JSON.stringify(block0, null, 2));
