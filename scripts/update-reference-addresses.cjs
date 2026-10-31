const fs = require('fs');
let s = fs.readFileSync('src/lib/reference.js', 'utf8');

const p1 = s.indexOf('function replaceLondonAddressFlightNode(node) {');
const p2 = s.indexOf('function replaceContactBrandFlightNode(node) {');

const newFn = `function removeContactAddressesFlightNode(node) {\r\n  if (Array.isArray(node)) {\r\n    for (let i = 0; i < node.length; i++) {\r\n      const child = node[i];\r\n      if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('ContactDetails_addresses__')) {\r\n        node.splice(i, 1);\r\n        return true;\r\n      }\r\n      if (removeContactAddressesFlightNode(child)) return true;\r\n    }\r\n  } else if (node && typeof node === 'object') {\r\n    for (const key of Object.keys(node)) {\r\n      if (removeContactAddressesFlightNode(node[key])) return true;\r\n    }\r\n  }\r\n  return false;\r\n}\r\n\r\n`;

s = s.slice(0, p1) + newFn + s.slice(p2);

// Replace caller in replaceContactEmailsFlightRow
s = s.replace(
  'replaceLondonAddressFlightNode(document);',
  'removeContactAddressesFlightNode(document);'
);

// In localizeFlight, also call removeContactAddressesFlightNode
const oldCheck = `if (prefix && row.includes('ContactDetails_contactDetails__')) {\r\n        const document = JSON.parse(row.slice(prefix.length));\r\n        replaceContactBrandFlightNode(document);\r\n        row = prefix + JSON.stringify(document) + (row.endsWith('\\n') ? '\\n' : '');\r\n      }`;
const newCheck = `if (prefix && (row.includes('ContactDetails_contactDetails__') || row.includes('ContactDetails_addresses__'))) {\r\n        const document = JSON.parse(row.slice(prefix.length));\r\n        replaceContactBrandFlightNode(document);\r\n        removeContactAddressesFlightNode(document);\r\n        row = prefix + JSON.stringify(document) + (row.endsWith('\\n') ? '\\n' : '');\r\n      }`;
s = s.replace(oldCheck, newCheck);

// In replaceContactEmailsHtml, remove addresses block
const addrStart = s.indexOf('    const addressPattern = /<div class="ContactDetails_address__');
const addrEnd = s.indexOf('    const emailPattern = /<div class="ContactDetails_email__');
const newAddrMarkup = "    section = section.replace(/<div class=\"ContactDetails_addresses__[^\\\"]*\\\"[\\s\\S]*?<\\/div>\\s*<\\/div>/, '');\r\n";
s = s.slice(0, addrStart) + newAddrMarkup + s.slice(addrEnd);

fs.writeFileSync('src/lib/reference.js', s, 'utf8');
console.log('src/lib/reference.js successfully updated via index slice!');
