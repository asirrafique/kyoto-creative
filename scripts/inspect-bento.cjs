const fs = require('fs');

const orig0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const p0efMatch = [...orig0ef.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
p0efMatch.forEach((m, i) => {
  if (m[1].startsWith('e:')) {
    console.log('Push with e: is index', i);
    const unescaped = JSON.parse('"' + m[1] + '"');
    const parsed = JSON.parse(unescaped.slice(2));
    const bento = parsed[2][3].children[1];
    console.log(JSON.stringify(bento, null, 2));
  }
});
