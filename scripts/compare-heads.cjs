const fs = require('fs');

const pilotHtml = fs.readFileSync('reference/pages/88pilot_project_page.html', 'utf8');
const gsHtml = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

// Compare <head> and scripts
const pilotHead = pilotHtml.slice(0, pilotHtml.indexOf('<body>'));
const gsHead = gsHtml.slice(0, gsHtml.indexOf('<body>'));

console.log('pilotHead length:', pilotHead.length);
console.log('gsHead length:', gsHead.length);

const pilotScripts = [...pilotHead.matchAll(/<script[^>]*src="([^"]*)"/g)].map(m => m[1]);
const gsScripts = [...gsHead.matchAll(/<script[^>]*src="([^"]*)"/g)].map(m => m[1]);

console.log('pilotScripts:', pilotScripts);
console.log('gsScripts:', gsScripts);
