const fs = require('fs');

let rsc = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.rsc', 'utf8');
const pRsc = rsc.indexOf('Culture_culture__lmpEt');
console.log('Current RSC segment:', rsc.substring(pRsc, pRsc + 180));

const oldRsc = '{"className":"Culture_culture__lmpEt","children":["$","$1c",null,{"fallback":null,"children":["$","$L1d",null,{"reason":"next/dynamic","children":"$L25"}]}]]]]}],["$","div"';
const newRsc = '{"className":"Culture_culture__lmpEt","children":[["$","$1c",null,{"fallback":null,"children":["$","$L1d",null,{"reason":"next/dynamic","children":"$L25"}]}]]}],["$","div"';

if (rsc.includes(oldRsc)) {
  rsc = rsc.replace(oldRsc, newRsc);
  fs.writeFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.rsc', rsc, 'utf8');
  console.log('RSC brackets corrected successfully!');
} else {
  console.log('Old RSC string not found.');
}

let html = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');
const pHtml = html.lastIndexOf('Culture_culture__lmpEt');
console.log('Current HTML flight segment:', html.substring(pHtml, pHtml + 220));

const oldFlight = '{\\"className\\":\\"Culture_culture__lmpEt\\",\\"children\\":[\\"$\\",\\"$2e\\",null,{\\"fallback\\":null,\\\"children\\":[\\"$\\",\\"$L2f\\",null,{\\"reason\\":\\"next/dynamic\\",\\"children\\":[\\"$\\",\\"$L37\\",null,{}]}]}]';
const newFlight = '{\\"className\\":\\"Culture_culture__lmpEt\\",\\"children\\":[[\\"$\\",\\"$2e\\",null,{\\"fallback\\":null,\\\"children\\":[\\"$\\",\\"$L2f\\",null,{\\"reason\\":\\"next/dynamic\\",\\"children\\":[\\"$\\",\\"$L37\\",null,{}]}]}]]';

// Let's check exact string around pHtml
const flightStart = html.indexOf('{\\"className\\":\\"Culture_culture__lmpEt\\"', pHtml - 20);
const flightEnd = html.indexOf(',[\\\"$\\\",\\\"div\\\",null,{\\\"className\\\":\\\"Partners_partners__jBo8y\\\"', flightStart);
console.log('Exact flight snippet:', html.substring(flightStart, flightEnd));

const targetFlight = '{\\"className\\":\\"Culture_culture__lmpEt\\",\\"children\\":[[\\"$\\",\\"$2e\\",null,{\\"fallback\\":null,\\\"children\\":[\\"$\\",\\"$L2f\\",null,{\\"reason\\":\\"next/dynamic\\",\\"children\\":[\\"$\\",\\"$L37\\",null,{}]}]}]]}';
html = html.substring(0, flightStart) + targetFlight + html.substring(flightEnd);
fs.writeFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', html, 'utf8');
console.log('HTML flight segment corrected successfully!');
