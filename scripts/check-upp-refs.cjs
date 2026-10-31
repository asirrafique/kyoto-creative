const fs = require('fs');
const upp = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const parts = [];
upp.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
});
const text = parts.join('');

const idx = text.indexOf('Results 30 days post-launch');
const start = text.lastIndexOf('["$","section"', idx);
const end = text.indexOf(',["$","section",null,{"className":"RelatedPosts_relatedPosts__xfLkb"', idx);
console.log('Snippet length:', end - start);
const htmlFlightSection = text.slice(start, end);
fs.writeFileSync('scripts/target_html_flight_section.txt', htmlFlightSection, 'utf8');

// Find all $Lxx references in this section
const regex = /\$L([a-f0-9]+)/gi;
let m;
const refs = new Set();
while ((m = regex.exec(htmlFlightSection)) !== null) {
  refs.add(m[1]);
}
console.log('References in UPP HTML flight section:', Array.from(refs));

refs.forEach(r => {
  const uppLine = text.split('\n').find(l => l.startsWith(r + ':I['));
  console.log(`Ref $L${r}: ${uppLine || 'not found'}`);
});
