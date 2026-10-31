const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
let m;
let pushes = [];
while ((m = re.exec(html)) !== null) {
  pushes.push(JSON.parse('"' + m[1] + '"'));
}
const flightText = pushes.join('');
const idx = flightText.indexOf('e:[');
console.log('e:[ found at:', idx);
if (idx !== -1) {
  console.log('Substring around idx:', flightText.slice(idx - 20, idx + 80).replace(/\n/g, '\\n'));
  const rest = flightText.slice(idx + 2);
  console.log('Rest starts with:', rest.slice(0, 50));
  try {
    const parsed = JSON.parse(rest);
    console.log('Parsed successfully! Length:', parsed.length);
  } catch (err) {
    console.log('JSON parse error:', err.message);
  }
}
