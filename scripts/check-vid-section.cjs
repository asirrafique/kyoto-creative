const fs = require('fs');
const html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const vidIdx = html.indexOf('Video_video__2erdW');
const secStart = html.lastIndexOf('<section', vidIdx);
const secEnd = html.indexOf('</section>', vidIdx) + 10;

console.log('Video section between Intro and Challenge:');
console.log(html.slice(secStart, secEnd));
