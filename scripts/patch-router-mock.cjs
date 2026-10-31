const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// Replace (0,l.useRouter)() with safe fallback in 78267
// Let's find occurrences of useRouter in chunk
const patched = chunk
  .replaceAll('(0,l.useRouter)()', '((typeof window!=="undefined"&&window.next?.router)||{push:()=>{},replace:()=>{},prefetch:()=>{}})')
  .replaceAll('(0,l.usePathname)()', '(typeof window!=="undefined"?window.location.pathname:"/work")');

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', patched, 'utf8');
console.log('Replaced useRouter and usePathname in work chunk!');
