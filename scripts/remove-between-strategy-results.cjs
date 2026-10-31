const fs = require('fs');

let f = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');
let rsc = fs.readFileSync('reference/pages/green_square_infra_project_page.rsc', 'utf8');

// 1. In static HTML: remove everything between The Strategy section end and Results section start
const stratIdx = f.indexOf('The Strategy');
const resultsIdx = f.indexOf('Results 30 days post-launch');

const stratSecEnd = f.indexOf('</section>', stratIdx) + 10;
const resultsSecStart = f.lastIndexOf('<section', resultsIdx);

console.log('Cutting HTML between', stratSecEnd, 'and', resultsSecStart);
f = f.slice(0, stratSecEnd) + f.slice(resultsSecStart);

// 2. In Flight tree e:[[[...
const p15Match = [...f.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)][15];
const oldP15Str = p15Match[0];
const unescaped = JSON.parse('"' + p15Match[1] + '"');
const parsed = JSON.parse(unescaped.slice(unescaped.indexOf(':') + 1));

// In parsed[2][3].children[3][3].children (ContentBuilder blocks):
// Blocks 0 to 3 are:
// 0: Video
// 1: TextLeftListRight (The Challenge)
// 2: Video
// 3: TextLeftListRight (The Strategy)
// Blocks 4 to 14 are the media galleries, text, and before-after between Strategy and Results.
// Block 15: Results
// Block 16: The Impact
// Block 17: Quote

const cbBlocks = parsed[2][3].children[3][3].children;
console.log('Original cbBlocks length:', cbBlocks.length);

// Keep blocks 0..3 and 15..17:
const newCbBlocks = [
  cbBlocks[0],
  cbBlocks[1],
  cbBlocks[2],
  cbBlocks[3],
  cbBlocks[15],
  cbBlocks[16],
  cbBlocks[17]
];
parsed[2][3].children[3][3].children = newCbBlocks;
console.log('New cbBlocks length:', newCbBlocks.length);

const newFlightJson = JSON.stringify(parsed);
const newPush = 'e:' + newFlightJson;
const newScriptTag = '<script>self.__next_f.push(' + JSON.stringify([1, newPush]).replaceAll('<', '\\u003c') + ')</script>';

f = f.replace(oldP15Str, newScriptTag);

// 3. Also update .rsc file:
// In .rsc, the tree is under chunk 2:[[[
const rsc2Idx = rsc.indexOf('\n2:[[[');
if (rsc2Idx !== -1) {
  const rscNextChunk = rsc.indexOf('\n', rsc2Idx + 5);
  const json2Str = rsc.slice(rsc2Idx + 3, rscNextChunk !== -1 ? rscNextChunk : undefined);
  const parsed2 = JSON.parse(json2Str);
  if (parsed2[2][3] && parsed2[2][3].children && parsed2[2][3].children[3]) {
    const rscCb = parsed2[2][3].children[3][3].children;
    parsed2[2][3].children[3][3].children = [
      rscCb[0],
      rscCb[1],
      rscCb[2],
      rscCb[3],
      rscCb[15],
      rscCb[16],
      rscCb[17]
    ];
    const newJson2 = JSON.stringify(parsed2);
    rsc = rsc.slice(0, rsc2Idx + 3) + newJson2 + (rscNextChunk !== -1 ? rsc.slice(rscNextChunk) : '');
    console.log('Updated .rsc tree successfully!');
  }
}

fs.writeFileSync('reference/pages/green_square_infra_project_page.html', f, 'utf8');
fs.writeFileSync('reference/pages/green_square_infra_project_page.rsc', rsc, 'utf8');

console.log('Removed everything between The Strategy and Results 30 days post-launch in both HTML and RSC!');
