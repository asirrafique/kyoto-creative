const fs = require('fs');

const p88 = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');

function getScripts(html) {
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const scripts = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    scripts.push({ tag: m[0].slice(0, 100), content: m[1] });
  }
  return scripts;
}

const scripts = getScripts(p88);
console.log('Total scripts:', scripts.length);
scripts.forEach((s, idx) => {
  if (s.content.includes('__next_f')) {
    console.log(`Script ${idx} has __next_f, length: ${s.content.length}`);
  } else if (s.tag.includes('src=')) {
    console.log(`Script ${idx} src:`, s.tag);
  }
});
