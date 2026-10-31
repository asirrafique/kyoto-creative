const fs = require('fs');
let code = fs.readFileSync('src/lib/work-archive-mount.js', 'utf8');

code = code.replace("if (typeof window === 'undefined') return;", "// browser runtime execution");
fs.writeFileSync('src/lib/work-archive-mount.js', code, 'utf8');
console.log('Fixed work-archive-mount.js!');
