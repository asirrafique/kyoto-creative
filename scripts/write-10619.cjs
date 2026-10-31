const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\373d9efa-c576-44ee-bed0-7c9f5081681a\\.system_generated\\logs\\transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

rl.on('line', (line) => {
  if (line.includes('"step_index":10619')) {
    const obj = JSON.parse(line);
    fs.writeFileSync('scripts/update-all-gs-content.mjs', obj.tool_calls[0].args.Content, 'utf8');
    console.log('Saved update-all-gs-content.mjs!');
  }
});
