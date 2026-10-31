const fs = require('fs');
const html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const lines = html.split('\n');
const line = lines[85];
const match = line.match(/push\(\[1,\s*"(.*?)"\]\)/s);
const unescaped = JSON.parse('"' + match[1] + '"');
const colonIdx = unescaped.indexOf(':');
const jsonStr = unescaped.slice(colonIdx + 1);
const parsed = JSON.parse(jsonStr);
const cb = parsed[2][3].children[3];
console.log('cb is:', cb[0], cb[1], cb[2], Object.keys(cb[3]));
console.log('cb.children count:', cb[3].children.length);
cb[3].children.forEach((c, i) => {
  console.log('Child', i, 'key:', c[1], 'tag:', c[0], 'type:', c[3] ? c[3].className : 'no class');
});
