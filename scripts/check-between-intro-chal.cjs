const fs = require('fs');
const html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

const introIdx = html.indexOf('Intro_intro__kvY3Y');
const chalIdx = html.indexOf('A website worthy of');

console.log('Intro index:', introIdx, 'Challenge index:', chalIdx);
const between = html.slice(introIdx, chalIdx);
const sections = [...between.matchAll(/<section[^>]*class="([^"]*)"/g)];
sections.forEach((s, i) => console.log(i, s[1].split(' ')[0]));
