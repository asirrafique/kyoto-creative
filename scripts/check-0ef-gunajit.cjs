const fs = require('fs');

const f = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

// Find Gunajit Dutta in 0ef3d4
console.log('Gunajit Dutta in 0ef3d4:', f.includes('Gunajit Dutta'));

// Find Results 30 days
console.log('Results 30 days in 0ef3d4:', f.includes('Results 30 days'));
