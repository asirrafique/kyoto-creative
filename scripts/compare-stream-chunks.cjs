const fs = require('fs');

const gs = fs.readFileSync('scripts/gsFlight.txt', 'utf8');
const pilot = fs.readFileSync('scripts/pilotFlight.txt', 'utf8');

function parseStream(str) {
  const chunks = {};
  // Flight stream lines: <id>:<data>
  // Some data spans multiple lines if not separated by newline + id:
  const lines = str.split('\n');
  let curId = null;
  let curBuf = [];
  for (const line of lines) {
    const m = line.match(/^([0-9a-f]+):(.*)$/);
    if (m) {
      if (curId) chunks[curId] = curBuf.join('\n');
      curId = m[1];
      curBuf = [m[2]];
    } else {
      if (curBuf) curBuf.push(line);
    }
  }
  if (curId) chunks[curId] = curBuf.join('\n');
  return chunks;
}

const gsChunks = parseStream(gs);
const pilotChunks = parseStream(pilot);

console.log('GS chunk IDs count:', Object.keys(gsChunks).length);
console.log('Pilot chunk IDs count:', Object.keys(pilotChunks).length);

const pilotKeys = new Set(Object.keys(pilotChunks));
const gsKeys = new Set(Object.keys(gsChunks));

const inPilotNotGs = [...pilotKeys].filter(k => !gsKeys.has(k));
const inGsNotPilot = [...gsKeys].filter(k => !pilotKeys.has(k));

console.log('In Pilot but not GS:', inPilotNotGs);
console.log('In GS but not Pilot:', inGsNotPilot);

for (const k of pilotKeys) {
  if (gsKeys.has(k) && k !== 'e' && k !== '0' && k !== '26' && k !== '1b' && k !== '1a') {
    if (pilotChunks[k] !== gsChunks[k]) {
      console.log(`Mismatch in chunk ${k}:`);
      console.log('Pilot:', pilotChunks[k].slice(0, 80));
      console.log('GS:   ', gsChunks[k].slice(0, 80));
    }
  }
}
