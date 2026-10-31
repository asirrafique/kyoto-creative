const fs = require('fs');
let c = fs.readFileSync('src/lib/localize.mjs', 'utf8');

c = c.replace(
  "'.Footer_email__nLajh{font-size:clamp(2.25rem, 5.5vw, 5rem)!important;line-height:1.1!important;}' +\r\n      '\r\n      '.Hero_introText__wboFn",
  "'.Footer_email__nLajh{font-size:clamp(2.25rem, 5.5vw, 5rem)!important;line-height:1.1!important;}' +\r\n      '.Hero_introText__wboFn"
);
c = c.replace(
  "'.Footer_email__nLajh{font-size:clamp(2.25rem, 5.5vw, 5rem)!important;line-height:1.1!important;}' +\n      '\n      '.Hero_introText__wboFn",
  "'.Footer_email__nLajh{font-size:clamp(2.25rem, 5.5vw, 5rem)!important;line-height:1.1!important;}' +\n      '.Hero_introText__wboFn"
);

fs.writeFileSync('src/lib/localize.mjs', c, 'utf8');
console.log('Fixed syntax in localize.mjs');
