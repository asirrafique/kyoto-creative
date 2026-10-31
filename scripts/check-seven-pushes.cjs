const fs = require('fs');
const html = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');

const pPushMatch = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
pPushMatch.forEach((m, idx) => {
  if (m[1].includes('More Than a Website') || m[1].includes('Brand Experience') || m[1].includes('bucher') || m[1].includes('Bucher')) {
    console.log('Push', idx, m[1].slice(0, 80));
  }
});
