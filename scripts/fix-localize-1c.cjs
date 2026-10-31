const fs = require('fs');

let content = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const target = `  // On pages with full layouts, KotaverseCta is referenced in children array as ,"$L57" (HTML) or ,"$L46" (RSC);
  // on pages without subheader/intro layout (like /contact, /culture), it is ,"$L2c" (HTML) or ,"$L1c" (RSC).
  // Note: in RSC stream, it is unescaped ,"$L1c" or ,"$L46"; in raw HTML pushes, it can be escaped ,\\"$L2c\\".
  // NEVER strip footer references (which are "footer":"$L1c" or "footer":"$Le") - only array item references ,"$L..."!
  text = text.replace(/,(?:\\{1,3}"\\$L(?:57|46|2c|1c)\\{1,3}"|"\\$L(?:57|46|2c|1c)")/g, '');
  text = text.replace(/<script[^>]*>\\s*self\\.__next_f\\.push\\(\\[1,"(?:57|46|2c|1c):\\[\\\\?"\\$\\\\?",\\\\?"section\\\\?",null,\\{\\\\?"className\\\\?":\\\\?"KotaverseCta_kotaverseCta__bBpWa\\\\?"[\\s\\S]*?"\\]\\)\\s*<\\/script>/g, '');
  text = text.replace(/(?:^|[\\r\\nZ])(?:46|1c|2c|57):\\["\\$","section",null,\\{"className":"KotaverseCta_kotaverseCta__bBpWa"[\\s\\S]*?(?=[\\r\\n]+\\w+:|$)/g, match => match.startsWith('Z') ? 'Z' : '');`;

// normalize CRLF
const targetNormalized = target.replace(/\r\n/g, '\n');
const contentNormalized = content.replace(/\r\n/g, '\n');

console.log('Target normalized found?:', contentNormalized.includes(targetNormalized));

const replacement = `  // On pages with full layouts, KotaverseCta is referenced in children array as ,"$L57" (HTML) or ,"$L46" (RSC);
  // on pages without subheader/intro layout (like /contact, /culture), it is ,"$L2c" (HTML).
  // Note: in RSC stream, on single project pages $L1c is the badge component, DO NOT strip $L1c!
  // NEVER strip footer references (which are "footer":"$L1c" or "footer":"$Le") - only array item references ,"$L..."!
  text = text.replace(/,(?:\\{1,3}"\\$L(?:57|46|2c)\\{1,3}"|"\\$L(?:57|46|2c)")/g, '');
  text = text.replace(/<script[^>]*>\\s*self\\.__next_f\\.push\\(\\[1,"(?:57|46|2c):\\[\\\\?"\\$\\\\?",\\\\?"section\\\\?",null,\\{\\\\?"className\\\\?":\\\\?"KotaverseCta_kotaverseCta__bBpWa\\\\?"[\\s\\S]*?"\\]\\)\\s*<\\/script>/g, '');
  text = text.replace(/(?:^|[\\r\\nZ])(?:46|2c|57):\\["\\$","section",null,\\{"className":"KotaverseCta_kotaverseCta__bBpWa"[\\s\\S]*?(?=[\\r\\n]+\\w+:|$)/g, match => match.startsWith('Z') ? 'Z' : '');`;

if (contentNormalized.includes(targetNormalized)) {
  const newContent = contentNormalized.replace(targetNormalized, replacement);
  fs.writeFileSync('src/lib/localize.mjs', newContent, 'utf8');
  console.log('Successfully updated localize.mjs to NOT strip 1c!');
}
