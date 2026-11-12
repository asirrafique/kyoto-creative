import fs from 'fs';

const html = fs.readFileSync('reference/pages/7b2d2acbfe7322b6e1c94f671f96482d4a8beb0be75535d155fc00a3d812397d.html', 'utf8');

const regex = /<section[^>]*>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(match[0]);
}

// Check headings
const hRegex = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g;
while ((match = hRegex.exec(html)) !== null) {
  console.log('Heading:', match[1].replace(/<[^>]+>/g, '').trim());
}
