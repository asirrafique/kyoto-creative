const fs = require('fs');

const h88 = fs.readFileSync('scripts/live88.html', 'utf8');
const hGs = fs.readFileSync('scripts/liveGs.html', 'utf8');

const s88 = [...h88.matchAll(/<script[\s\S]*?<\/script>/g)].map(m => m[0]);
const sGs = [...hGs.matchAll(/<script[\s\S]*?<\/script>/g)].map(m => m[0]);

function extractFlight(scriptTag) {
  const match = scriptTag.match(/self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/);
  return JSON.parse(match[1])[1];
}

const data88 = extractFlight(s88[18]);
const dataGs = extractFlight(sGs[18]);

console.log('data88 length:', data88.length);
console.log('dataGs length:', dataGs.length);

fs.writeFileSync('scripts/liveFlight88.txt', data88, 'utf8');
fs.writeFileSync('scripts/liveFlightGs.txt', dataGs, 'utf8');
console.log('Saved liveFlight88 and liveFlightGs successfully!');
