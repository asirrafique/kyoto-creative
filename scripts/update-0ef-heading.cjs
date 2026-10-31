const fs = require('fs');

let html0ef = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

// Replace the h1 text in flight push 15
const oldHeading = 'Building an AI-Powered HR Compliance Platform';
const newHeading = 'Turning Digital Marketing into a Lead Generation Engine';

console.log('Includes oldHeading?:', html0ef.includes(oldHeading));

if (html0ef.includes(oldHeading)) {
  html0ef = html0ef.replaceAll(oldHeading, newHeading);
  fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', html0ef, 'utf8');
  console.log('Successfully updated heading to Turning Digital Marketing into a Lead Generation Engine!');
}
