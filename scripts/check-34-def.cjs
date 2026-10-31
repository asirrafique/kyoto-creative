const fs = require('fs');

const pSeven = fs.readFileSync('reference/pages/00233791275663c6132600d66c4d480955bcc4ce5fb255c3b28df4e4b1f1e686.html', 'utf8');
const pGreen = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

function checkDefs(html, name) {
  const fMatches = [...html.matchAll(/<script>self\.__next_f\.push\((.*?)\)<\/script>/gs)];
  fMatches.forEach((m, i) => {
    const s = JSON.parse(m[1])[1];
    if (s.includes('34:')) {
      console.log(`${name} chunk ${i} has 34:`, s.slice(0, 150));
    }
    if (s.includes('33:')) {
      console.log(`${name} chunk ${i} has 33:`, s.slice(0, 150));
    }
  });
}

checkDefs(pSeven, 'Seven');
checkDefs(pGreen, 'Green');
