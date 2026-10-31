const { execSync } = require('child_process');
const fs = require('fs');

const orig88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const orig0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');

function getEntriesWithLines(html) {
  const parts = [];
  html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
    try {
      const value = JSON.parse(data);
      if (value[0] === 1) parts.push(value[1]);
    } catch {}
  });
  const stream = parts.join('');
  // Split on newlines that precede an ID at start of line
  const regex = /(?:^|\n)([0-9a-f]+:[^\n]*)/g;
  const entries = [];
  let m;
  while ((m = regex.exec(stream)) !== null) {
    entries.push(m[1].slice(0, 50));
  }
  return entries;
}

console.log('88 IDs count:', getEntriesWithLines(orig88).length);
console.log('88 IDs:', getEntriesWithLines(orig88));
console.log('0ef IDs count:', getEntriesWithLines(orig0ef).length);
console.log('0ef IDs:', getEntriesWithLines(orig0ef));
