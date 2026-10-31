const fs = require('fs');
const upp = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');
const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

const oldStat1 = '<span class="Results_figure__t8hvp">+44.8%</span><span class="Results_description__KhIC1"> increase in sessions from Google.</span>';
console.log('oldStat1 in upp?:', upp.includes(oldStat1));
console.log('oldStat1 in loc?:', loc.includes(oldStat1));

const idx = upp.indexOf('Results 30 days');
console.log('UPP around Results 30 days:');
console.log(upp.slice(idx, idx + 400));
