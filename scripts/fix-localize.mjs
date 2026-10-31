import fs from 'fs';

const htmlSection = fs.readFileSync('scripts/final_html_section.txt', 'utf8');
const htmlFlightSection = fs.readFileSync('scripts/final_html_flight_section.txt', 'utf8');
const rscFlightSection = fs.readFileSync('scripts/final_rsc_flight_section.txt', 'utf8');

let loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const lines = loc.split('\n');

// We know lines 13, 14, 15
// Line 14 (idx 13): HTML replacement
// Line 15 (idx 14): RSC replacement
// Line 16 (idx 15): HTML flight replacement

// Let's inspect the target strings by parsing the first argument of replaceAll
const getTarget = (line) => {
  const match = line.match(/^  text = text\.replaceAll\(([\s\S]*?),/);
  return JSON.parse(match[1]);
};

const line14Target = getTarget(lines[13]);
const line15Target = getTarget(lines[14]);
const line16Target = getTarget(lines[15]);

// Notice: line15Target in raw bsRsc is:
// ,["$","section",null,{"className":"MediaGallery... ...]]]
// When replacing it, the original ends with a comma if another element followed it!
// Let's verify line15Target ends with comma or bracket:
console.log('line15Target ends with:', line15Target.slice(line15Target.length - 20));
console.log('line16Target ends with:', line16Target.slice(line16Target.length - 20));

// Notice line15Target ends with comma: "...brandColour\":\"#b8c8ff\"}]]}],null,null,"
// So our replacement MUST also end with a comma!
lines[13] = '  text = text.replaceAll(' + JSON.stringify(line14Target) + ', ' + JSON.stringify(htmlSection) + ');';
lines[14] = '  text = text.replaceAll(' + JSON.stringify(line15Target) + ', ' + JSON.stringify(',' + rscFlightSection + ',') + ');';
lines[15] = '  text = text.replaceAll(' + JSON.stringify(line16Target) + ', ' + JSON.stringify(',' + htmlFlightSection + ',') + ');';

fs.writeFileSync('src/lib/localize.mjs', lines.join('\n'), 'utf8');
console.log('Successfully updated localize.mjs with ending comma!');
