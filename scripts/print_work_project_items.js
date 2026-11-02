const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

function getPushPayloads(h) {
  const pushes = [];
  let pos = 0;
  while ((pos = h.indexOf('self.__next_f.push([1,', pos)) !== -1) {
    const end = h.indexOf('</script>', pos);
    const raw = h.slice(pos + 'self.__next_f.push([1,'.length, end - 2);
    pushes.push(JSON.parse(raw));
    pos = end + 1;
  }
  return pushes;
}

const full = getPushPayloads(html).join('');
const ePrefix = '["$","$L2e",null,{"projects":';
const eIdx = full.indexOf(ePrefix);
const sub = full.slice(eIdx + ePrefix.length);
let depth = 0;
let end = 0;
for (let i = 0; i < sub.length; i++) {
  if (sub[i] === '[') depth++;
  else if (sub[i] === ']') {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}

const rawProjects = JSON.parse(sub.slice(0, end));
console.log('Project 0 (seas):', JSON.stringify(rawProjects[0], null, 2));
console.log('Project 1 (bankrate):', JSON.stringify(rawProjects[1], null, 2));
console.log('Project 2 (bipsync):', JSON.stringify(rawProjects[2], null, 2));
