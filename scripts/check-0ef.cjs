const fs = require('fs');

const f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

console.log('Includes More Than a Website?', f.includes('More Than a Website') || f.includes('More than a Website'));
console.log('Includes Five strategic?', f.includes('Five strategic pillars'));
console.log('Includes Seven Gate Holdings?', f.includes('Seven Gate Holdings'));
console.log('Includes Green Square Infra?', f.includes('Green Square Infra'));
