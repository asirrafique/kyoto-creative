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
console.log('Push 20 starts with:', p20.slice(0, 30));

const colon = p20.indexOf(':');
console.log('Colon index:', colon);
const jsonPart = p20.slice(colon + 1);

try {
  const parsed = JSON.parse(jsonPart);
  console.log('Push 20 parsed successfully! Array length:', parsed.length);
} catch (e) {
  console.log('Push 20 parse error:', e.message);
}
