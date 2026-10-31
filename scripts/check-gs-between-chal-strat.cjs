const fs = require('fs');
const html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const chalIdx = html.indexOf('The Challenge');
const stratIdx = html.indexOf('The Strategy');

console.log('Chal index:', chalIdx, 'Strat index:', stratIdx);
const between = html.slice(chalIdx, stratIdx);
console.log('Between Challenge and Strategy in current green_square_infra:');
console.log(between);
