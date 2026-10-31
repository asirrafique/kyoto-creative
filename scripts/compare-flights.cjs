const { execSync } = require('child_process');
const fs = require('fs');

const orig88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const orig0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');

function getEntries(html) {
  const parts = [];
  html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
    try {
      const value = JSON.parse(data);
      if (value[0] === 1) parts.push(value[1]);
    } catch {}
  });
  const stream = parts.join('');
  const lines = stream.split('\n');
  const entries = [];
  let currentId = null;
  for (const l of lines) {
    const colonIdx = l.indexOf(':');
    if (colonIdx > 0 && colonIdx < 5) {
      currentId = l.slice(0, colonIdx);
      entries.push({ id: currentId, len: l.length, start: l.slice(0, 40) });
    }
  }
  return entries;
}

console.log('88 entries:');
console.table(getEntries(orig88));

console.log('0ef entries:');
console.table(getEntries(orig0ef));
