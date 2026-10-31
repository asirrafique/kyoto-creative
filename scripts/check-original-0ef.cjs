const { execSync } = require('child_process');
const original0ef = execSync('git show HEAD:reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');

const matches = [...original0ef.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
matches.forEach((m, idx) => {
  const content = m[1];
  console.log('Push', idx, 'prefix:', content.slice(0, 30));
});
