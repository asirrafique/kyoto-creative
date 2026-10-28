import fs from 'fs';

const html = fs.readFileSync('reference/pages/8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1.html', 'utf8');

const sIdx = html.indexOf('class="HeroSplitTextDesktop_desktop__Bey7n"');
const svgStart = html.lastIndexOf('<svg', sIdx);
const svgEnd = html.indexOf('</svg>', sIdx) + 6;
console.log('Desktop SVG start:', svgStart, 'end:', svgEnd, 'len:', svgEnd - svgStart);

const mIdx = html.indexOf('class="Hero_mobile__VkWXK"');
const mStart = html.lastIndexOf('<svg', mIdx);
const mEnd = html.indexOf('</svg>', mIdx) + 6;
console.log('Mobile SVG start:', mStart, 'end:', mEnd, 'len:', mEnd - mStart);
