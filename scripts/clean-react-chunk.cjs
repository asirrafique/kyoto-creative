const fs = require('fs');

const chunk = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', 'utf8');

let cleaned = chunk
  .replaceAll('console.log("t8 HYDRATION MISMATCH DETECTED for:", e.type, e.tag, e.stateNode, e.memoizedProps?.className || e.pendingProps?.className);', '')
  .replaceAll('console.log("t1 PREVENTED DELETING DOM NODE:", t.nodeName);', '')
  .replaceAll('console.log("t3 matching DOM node:", t.nodeName, t.className, "against fiber:", e.type);', '')
  .replaceAll('console.log("Reconciler processing tag 5 fiber:", t.type, "tG is:", tG?.nodeName, tG?.className);', '')
  .replaceAll('console.log("lZ Suspense entry! tZ is:", tZ, "tG is:", tG?.nodeName, tG?.className, tG?.data);', '')
  .replaceAll('console.log("SWITCH TAG 3 (Root)", "tG was:", tG?.nodeName, tG?.className);', '')
  .replaceAll('if(!tX)console.log("t9 REACHED ROOT for fiber:", e.type, "tG is:", tG?.nodeName);', '')
  .replaceAll('console.log("nt CALLED, hydration ended! tZ was:", tZ);', '');

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/fd9d1056-2f07626ddf804ce1.js', cleaned, 'utf8');
console.log('Cleaned fd9d1056 React chunk!');
