import fs from 'fs';

const assets = JSON.parse(fs.readFileSync('reference/assets.json', 'utf8'));
const filePath = assets['https://kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js'];
const code = fs.readFileSync(filePath, 'utf8');

const idx = code.indexOf('NavigationContextProvider:function(){return d}');
console.log(code.slice(idx + 700, idx + 1600));
