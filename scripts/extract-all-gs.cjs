const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\373d9efa-c576-44ee-bed0-7c9f5081681a\\.system_generated\\logs\\transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

const stepsToExtract = [10499, 10523, 10563, 10581, 10599];
rl.on('line', (line) => {
  for (const s of stepsToExtract) {
    if (line.includes(`"step_index":${s}`)) {
      const obj = JSON.parse(line);
      const filename = `scripts/extracted_${s}.mjs`;
      fs.writeFileSync(filename, obj.tool_calls[0].args.Content, 'utf8');
      console.log(`Saved ${filename}`);
    }
  }
});
