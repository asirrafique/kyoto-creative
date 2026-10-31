const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\373d9efa-c576-44ee-bed0-7c9f5081681a\\.system_generated\\logs\\transcript_full.jsonl');
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

rl.on('line', (line) => {
  if (line.includes('Gunajit Dutta') && !line.includes('13144') && (line.includes('write_file') || line.includes('edit_file'))) {
    const obj = JSON.parse(line);
    console.log('Step:', obj.step_index);
  }
});
