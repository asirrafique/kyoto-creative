const fs = require('fs');

let f = fs.readFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', 'utf8');

// Hook case 84: and case default: to log incoming flight chunks
const target = 'case 84:v._chunks.set(y,new b("fulfilled",_,null,v));break;';
const hooked = 'case 84:console.log("[FLIGHT T]", y, typeof _, _.length);v._chunks.set(y,new b("fulfilled",_,null,v));break;';

console.log('Includes case 84 target?:', f.includes(target));
f = f.replace(target, hooked);

// Also hook default (JSON chunks):
const defTarget = 'default:(O=(p=v._chunks).get(y))?';
const defHooked = 'default:if(y==="e"||y==="34"||y==="35")console.log("[FLIGHT CHUNK]", y, typeof _, _.length);(O=(p=v._chunks).get(y))?';
console.log('Includes defTarget?:', f.includes(defTarget));
f = f.replace(defTarget, defHooked);

fs.writeFileSync('public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js', f, 'utf8');
console.log('Hooked flight chunk parser!');
