const fs = require('fs');

let chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/app/work/page-5b3919766e28ce0e.js', 'utf8');

// Notice in module 86258:
// dangerouslySetInnerHTML:{__html:(null==j?void 0:null===(c=j.singleProject)||void 0===c?void 0:null===(i=c.hero)||void 0===i?void 0:i.heading)||(null==j?void 0:j.title)||""}
// Notice what i is: null===(i=c.hero)||void 0===i?void 0:i.heading
// Wait, is c.hero defined in 86258 or does 86258 use something else?
const idx = chunk.indexOf('function c(e){var t,r,i,c,u,d,v,f,m,p,h,g,_,x;let{project:j,size:w="small"}=e;');
console.log('function c in 86258:');
console.log(chunk.slice(idx, idx + 800));
