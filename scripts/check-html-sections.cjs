const { execSync } = require('child_process');
const fs = require('fs');

const orig0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');

// Find all <section tags in HTML body
const sections = [...orig0ef.matchAll(/<section[^>]*class="([^"]*)"/g)];
console.log('Static HTML sections count:', sections.length);
sections.forEach((s, idx) => {
  console.log(idx, s[1].split(' ')[0]);
});
