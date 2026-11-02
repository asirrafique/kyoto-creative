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

const pushes = getPushPayloads(html);
const full = pushes.join('');

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

const projects = JSON.parse(sub.slice(0, end));
console.log('Total projects in /work data:', projects.length);
projects.forEach((p, i) => {
  console.log(i, p.node.slug, '->', p.node.title);
});
