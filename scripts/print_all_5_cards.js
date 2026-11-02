const fs = require('fs');

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');

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
const p20 = pushes[20];
const parsed = JSON.parse(p20.slice(p20.indexOf(':') + 1));
const workProjectsObj = parsed[2][3].children[4][3].children[2];
const cards = workProjectsObj[3].children[3].children[3].children[0];

console.log('Cards count:', cards.length);
cards.forEach((c, idx) => {
  console.log(`\nCard ${idx}:`, JSON.stringify(c, null, 2));
});
