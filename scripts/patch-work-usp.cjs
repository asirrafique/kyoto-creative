const fs = require('fs');
const filePath = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js';
let js = fs.readFileSync(filePath, 'utf8');

// Replace (0,i.useSearchParams)() in 60119 with new URLSearchParams(window.location.search)
// In 60119:
// d=(0,i.useSearchParams)()
const t1 = 'd=(0,i.useSearchParams)()';
const r1 = 'd=new URLSearchParams(typeof window!=="undefined"?window.location.search:"")';

console.log('t1 found?', js.includes(t1));

// In 78267:
// g=(0,l.useSearchParams)()
// o=(0,l.useSearchParams)()
// c=(0,l.useSearchParams)()
// s=(0,l.useSearchParams)()
const t2 = 'g=(0,l.useSearchParams)()';
const r2 = 'g=new URLSearchParams(typeof window!=="undefined"?window.location.search:"")';

const t3 = 'o=(0,l.useSearchParams)()';
const r3 = 'o=new URLSearchParams(typeof window!=="undefined"?window.location.search:"")';

const t4 = 'c=(0,l.useSearchParams)()';
const r4 = 'c=new URLSearchParams(typeof window!=="undefined"?window.location.search:"")';

const t5 = 's=(0,l.useSearchParams)()';
const r5 = 's=new URLSearchParams(typeof window!=="undefined"?window.location.search:"")';

// In 40253:
// a=(0,l.useSearchParams)()
const t6 = 'a=(0,l.useSearchParams)()';
const r6 = 'a=new URLSearchParams(typeof window!=="undefined"?window.location.search:"")';

console.log('t2 found?', js.includes(t2));
console.log('t3 found?', js.includes(t3));
console.log('t4 found?', js.includes(t4));
console.log('t5 found?', js.includes(t5));
console.log('t6 found?', js.includes(t6));

js = js.replace(t1, r1);
js = js.replace(t2, r2);
js = js.replace(t3, r3);
js = js.replace(t4, r4);
js = js.replace(t5, r5);
js = js.replace(t6, r6);

fs.writeFileSync(filePath, js, 'utf8');
console.log('Successfully updated work chunk on disk!');
