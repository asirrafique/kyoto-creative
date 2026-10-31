const fs = require('fs');

const filePath = 'reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html';
let html = fs.readFileSync(filePath, 'utf8');

const overflowFixStyle = '<style>html,body{overflow-x:hidden!important;max-width:100vw!important}.container{max-width:100%!important;box-sizing:border-box!important}</style>';

if (!html.includes('overflow-x:hidden!important')) {
  html = html.replace('<head>', '<head>' + overflowFixStyle);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Injected overflow-x fix style into Seven Gate Holdings HTML!');
} else {
  console.log('Already contains overflow style!');
}
