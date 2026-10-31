const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

const patched = chunk.replace(
  'case 5:return null===e&&tZ&&((l=r=tG)?t3(t,l)||(t8(t)&&t5(),tG=ca(l),a=tX,tG&&t3(t,tG)?t1(a,l):(t2(tX,t),tZ=!1,tX=t,tG=r)):(t8(t)&&t5(),t2(tX,t),tZ=!1,tX=t,tG=r))',
  'case 5:console.log("Reconciler processing tag 5 fiber:", t.type, "tG is:", tG?.nodeName, tG?.className);return null===e&&tZ&&((l=r=tG)?t3(t,l)||(t8(t)&&t5(),tG=ca(l),a=tX,tG&&t3(t,tG)?t1(a,l):(t2(tX,t),tZ=!1,tX=t,tG=r)):(t8(t)&&t5(),t2(tX,t),tZ=!1,tX=t,tG=r))'
);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', patched, 'utf8');
console.log('Patched tag 5 entry log!');
