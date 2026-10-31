const fs = require('fs');

let content = fs.readFileSync('src/lib/localize.mjs', 'utf8');
const lines = content.split(/\r?\n/);

lines[126] = `  text = text.replace(/,(?:\\\\{1,3}"\\$L(?:57|46|2c)\\\\{1,3}"|"\\$L(?:57|46|2c)")/g, '');`;
lines[127] = `  text = text.replace(/<script[^>]*>\\s*self\\.__next_f\\.push\\(\\[1,"(?:57|46|2c):\\[\\\\?"\\$\\\\?",\\\\?"section\\\\?",null,\\{\\\\?"className\\\\?":\\\\?"KotaverseCta_kotaverseCta__bBpWa\\\\?"[\\s\\S]*?"\\]\\)\\s*<\\/script>/g, '');`;
lines[128] = `  text = text.replace(/(?:^|[\\r\\nZ])(?:46|2c|57):\\["\\$","section",null,\\{"className":"KotaverseCta_kotaverseCta__bBpWa"[\\s\\S]*?(?=[\\r\\n]+\\w+:|$)/g, match => match.startsWith('Z') ? 'Z' : '');`;

fs.writeFileSync('src/lib/localize.mjs', lines.join('\n'), 'utf8');
console.log('Successfully updated lines 126-128 in localize.mjs!');
