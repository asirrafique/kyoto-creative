const fs = require('fs');

const sgHtml = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

// Find all script tags in 0023
const scriptTags = [...sgHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[0]);
console.log('Script tags count in 0023:', scriptTags.length);
console.log('Does any script in 0023 have e:?', scriptTags.some(s => s.includes('"e:[')));
