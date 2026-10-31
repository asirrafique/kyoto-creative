const fs = require('fs');
const files = fs.readdirSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks');
files.forEach(f => {
  if (f.endsWith('.js')) {
    const c = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/' + f, 'utf8');
    if (c.includes('case 84:') || c.includes('case 116:')) {
      console.log('Match in file:', f);
    }
  }
});
