const fs = require('fs');

// We copy 0ef to green_square_infra_project_page.html and .rsc
fs.copyFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'reference/pages/green_square_infra_project_page.html');
fs.copyFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.rsc', 'reference/pages/green_square_infra_project_page.rsc');

// Update reference/routes.json
const routes = JSON.parse(fs.readFileSync('reference/routes.json', 'utf8'));
routes['/work/green-square-infra'] = 'green_square_infra_project_page.html';
fs.writeFileSync('reference/routes.json', JSON.stringify(routes, null, 2), 'utf8');

console.log('Successfully pointed /work/green-square-infra to green_square_infra_project_page.html!');
