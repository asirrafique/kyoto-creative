import fs from 'fs';

const htmlSection = fs.readFileSync('scripts/final_html_section.txt', 'utf8');
const htmlFlightSection = fs.readFileSync('scripts/final_html_flight_section.txt', 'utf8');
const rscFlightSection = fs.readFileSync('scripts/final_rsc_flight_section.txt', 'utf8');

let loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const lines = loc.split('\n');

const line14Target = JSON.parse(lines[13].slice('  text = text.replaceAll('.length, lines[13].length - ', \'\');'.length));
const line15Target = JSON.parse(lines[14].slice('  text = text.replaceAll('.length, lines[14].length - ', \'\');'.length));
const line16Target = JSON.parse(lines[15].slice('  text = text.replaceAll('.length, lines[15].length - ', \'\');'.length));

// For line 14 (HTML markup):
// replace with htmlSection
lines[13] = '  text = text.replaceAll(' + JSON.stringify(line14Target) + ', ' + JSON.stringify(htmlSection) + ');';

// For line 15 (RSC stream):
// replace with ',' + rscFlightSection
lines[14] = '  text = text.replaceAll(' + JSON.stringify(line15Target) + ', ' + JSON.stringify(',' + rscFlightSection) + ');';

// For line 16 (HTML flight parts):
// replace with ',' + htmlFlightSection
lines[15] = '  text = text.replaceAll(' + JSON.stringify(line16Target) + ', ' + JSON.stringify(',' + htmlFlightSection) + ');';

fs.writeFileSync('src/lib/localize.mjs', lines.join('\n'), 'utf8');
console.log('Successfully updated src/lib/localize.mjs with the new section!');
