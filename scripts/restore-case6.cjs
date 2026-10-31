const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'case 2:case 3:case 5:break;default:throw Error(i(329))',
  'case 2:case 3:case 5:case 6:break;default:throw Error(i(329))'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Restored case 6:break in React chunk!');
