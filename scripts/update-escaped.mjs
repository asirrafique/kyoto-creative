import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// Replace the escaped London, UK / SaaS in the client push
const target1 = `text = text.replaceAll('Bucher + Suter', 'Seven Gate Holdings');`;

const addition = `${target1}
  text = text.replaceAll('\\"children\\":\\"London, UK\\"', '\\"children\\":\\"Digital Strategy\\"');
  text = text.replaceAll('\\"children\\":\\"SaaS\\"', '\\"children\\":\\"Website Design & Development\\"');`;

const updated = loc.replace(target1, addition);
fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Added replacement for escaped strings in localize.mjs');
