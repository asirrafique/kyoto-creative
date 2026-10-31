const fs = require('fs');

const html = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const fMatches = [...html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)];
const str = JSON.parse(fMatches[14][1])[1];

const nullComps = str.match(/\["\$",null,/g);
console.log('Null comp matches:', nullComps ? nullComps.length : 0);

const undefComps = str.match(/\["\$",undefined,/g);
console.log('Undef comp matches:', undefComps ? undefComps.length : 0);

// Look for defined modules in all chunks: "id:I[..."
const definedIds = new Set();
fMatches.forEach(m => {
  const s = JSON.parse(m[1])[1];
  const modMatches = [...s.matchAll(/([0-9a-f]+):I\[/g)];
  modMatches.forEach(mm => definedIds.add(mm[1]));
});
console.log('Defined component IDs:', [...definedIds]);

const lRefs = [...str.matchAll(/"\$L([0-9a-f]+)"/g)].map(m => m[1]);
console.log('Unique $L refs in chunk 14:', [...new Set(lRefs)]);

const missing = [...new Set(lRefs)].filter(id => !definedIds.has(id));
console.log('MISSING component IDs:', missing);
