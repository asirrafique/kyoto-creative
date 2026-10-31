const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\373d9efa-c576-44ee-bed0-7c9f5081681a\\.system_generated\\logs\\transcript.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

let steps = [];
rl.on('line', (line) => {
  if (line.includes('edit_file') && line.includes('localize.mjs')) {
    const obj = JSON.parse(line);
    steps.push({ step: obj.step_index, content: (obj.content || '').slice(0, 100) });
  }
});
rl.on('close', () => {
  console.log('Matches:', steps.length);
  console.log(JSON.stringify(steps, null, 2));
});
