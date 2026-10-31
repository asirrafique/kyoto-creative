const fs = require('fs');

const routes = JSON.parse(fs.readFileSync('reference/routes.json', 'utf8'));

for (const [k, v] of Object.entries(routes)) {
  if (k.includes('seven-gate') || k.includes('bucher') || k.includes('green-square')) {
    console.log(k, '->', v);
  }
}
