const fs = require('fs');

const originalPageJs = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// We want to replace `d=(0,i.useSearchParams)()` in module 60119 and in module 78267
// Let's check how useSearchParams is called in this file
const re = /useSearchParams\)\(\)/g;
console.log('useSearchParams matches in work chunk:', (originalPageJs.match(re) || []).length);

// Also check imports: r(99376) provides useSearchParams
// Let's check where 99376 is used
