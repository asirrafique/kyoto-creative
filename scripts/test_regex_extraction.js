const fs = require('fs');

const leadHtml = fs.readFileSync('reference/pages/leadcourt_project_page.html', 'utf8');

const parts = [];
const placeholder = '<!--replica-flight-stream-->';
let first = true;
const testHtml = leadHtml.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
  const result = first ? placeholder : '';
  first = false;
  return result;
});

console.log('parts.length:', parts.length);
console.log('parts includes title:', parts.some(p => p.includes('Leadcourt - Kyoto Creative')));
console.log('testHtml still has self.__next_f.push:', testHtml.includes('self.__next_f.push'));
