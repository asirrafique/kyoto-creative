const fs = require('fs');
const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

const re = /self\.__next_f\.push\(\[1,\s*"((?:[^"\\]|\\.)*)"\]\)/g;
let m;
let pushes = [];
while ((m = re.exec(html)) !== null) {
  pushes.push(JSON.parse('"' + m[1] + '"'));
}

const flightText = pushes.join('');
console.log('Total flight length:', flightText.length);

// Let's parse flight rows in flightText
const rows = [];
let cursor = 0;
while (cursor < flightText.length) {
  const colon = flightText.indexOf(':', cursor);
  if (colon !== -1 && flightText[colon + 1] === 'T') {
    const id = flightText.substring(cursor, colon);
    const comma = flightText.indexOf(',', colon + 2);
    const hex = flightText.substring(colon + 2, comma);
    if (/^[a-f\d]+$/i.test(id) && /^[a-f\d]+$/i.test(hex)) {
      const len = parseInt(hex, 16);
      const end = comma + 1 + len;
      const val = flightText.substring(comma + 1, end);
      rows.push({ id, type: 'T', hex, len, valPrefix: val.slice(0, 50) });
      cursor = end;
      continue;
    }
  }
  const newline = flightText.indexOf('\n', cursor);
  const end = newline === -1 ? flightText.length : newline + 1;
  const line = flightText.substring(cursor, end);
  const m = line.match(/^([a-f\d]+):(.*)/);
  if (m) {
    rows.push({ id: m[1], type: 'J', valPrefix: m[2].slice(0, 60) });
  } else {
    rows.push({ type: 'other', linePrefix: line.slice(0, 60) });
  }
  cursor = end;
}

console.log('Parsed rows count:', rows.length);
rows.forEach((r, idx) => {
  console.log(`Row ${idx}:`, r);
});
