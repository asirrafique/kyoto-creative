const fs = require('fs');
const html = fs.readFileSync('scripts/received-gs.html', 'utf8');

const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
console.log('Matches in received-gs.html:', matches.length);
matches.forEach((m, idx) => {
  console.log('Match', idx, m[1].slice(0, 100));
});

const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
console.log('All script tags count:', scripts.length);
scripts.forEach((s, idx) => {
  const content = s[1];
  if (content.length > 0) {
    console.log('Script', idx, content.slice(0, 80));
  } else {
    console.log('Script', idx, 'src:', s[0].match(/src="(.*?)"/)?.[1]);
  }
});
