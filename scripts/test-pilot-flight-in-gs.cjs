const fs = require('fs');

const pilotHtml = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');

// Isolate flight script tag
const pilotFlightScript = pilotHtml.match(/<script[^>]*>\s*self\.__next_f\.push\(\[1,"1:HL[\s\S]*?<\/script>/)[0];

let gsHtml = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const gsFlightScript = gsHtml.match(/<script[^>]*>\s*self\.__next_f\.push\(\[1,"1:HL[\s\S]*?<\/script>/)[0];

console.log('Pilot script length:', pilotFlightScript.length);
console.log('GS script length:', gsFlightScript.length);

const testHtml = gsHtml.replace(gsFlightScript, pilotFlightScript);
fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', testHtml, 'utf8');
console.log('Swapped pilot flight stream into 0ef!');
