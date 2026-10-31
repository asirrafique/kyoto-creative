const fs = require('fs');
let s = fs.readFileSync('src/lib/reference.js', 'utf8');

// 1. Add updateContactFollowsFlightNode right after removeContactAddressesFlightNode
const followsFn = `function updateContactFollowsFlightNode(node) {\r\n  if (Array.isArray(node)) {\r\n    for (let i = 0; i < node.length; i++) {\r\n      const child = node[i];\r\n      if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('ContactDetails_follows__')) {\r\n        const linksArray = child[3].children && child[3].children[1];\r\n        if (Array.isArray(linksArray)) {\r\n          for (const linkWrapper of linksArray) {\r\n            const aTag = linkWrapper && linkWrapper[3] && linkWrapper[3].children;\r\n            if (aTag && aTag[3] && aTag[3].children === 'awwwards') {\r\n              aTag[3].children = 'Instagram';\r\n              aTag[3].href = 'https://www.instagram.com/kotalondon/';\r\n            }\r\n          }\r\n          const clutchIdx = linksArray.findIndex(linkWrapper => {\r\n            const aTag = linkWrapper && linkWrapper[3] && linkWrapper[3].children;\r\n            return aTag && aTag[3] && aTag[3].children === 'Clutch';\r\n          });\r\n          if (clutchIdx !== -1) {\r\n            linksArray.splice(clutchIdx, 1);\r\n          }\r\n        }\r\n        return true;\r\n      }\r\n      if (updateContactFollowsFlightNode(child)) return true;\r\n    }\r\n  } else if (node && typeof node === 'object') {\r\n    for (const key of Object.keys(node)) {\r\n      if (updateContactFollowsFlightNode(node[key])) return true;\r\n    }\r\n  }\r\n  return false;\r\n}\r\n\r\n`;

const targetIndex = s.indexOf('function replaceContactBrandFlightNode(node) {');
s = s.slice(0, targetIndex) + followsFn + s.slice(targetIndex);

// 2. In replaceContactEmailsFlightRow, call updateContactFollowsFlightNode
s = s.replace(
  '  replaceContactBrandFlightNode(document);\r\n',
  '  replaceContactBrandFlightNode(document);\r\n  updateContactFollowsFlightNode(document);\r\n'
);

// 3. In localizeFlight, also call updateContactFollowsFlightNode
s = s.replace(
  '        removeContactAddressesFlightNode(document);\r\n',
  '        removeContactAddressesFlightNode(document);\r\n        updateContactFollowsFlightNode(document);\r\n'
);

// 4. In replaceContactEmailsHtml, update HTML follows block
const oldFollowsRepl = `    for (let index = blocks.length - 1; index >= 0; index--) {\r\n      section = section.slice(0, blocks[index].start) + updates[index] + section.slice(blocks[index].end);\r\n    }`;

const newFollowsRepl = `    for (let index = blocks.length - 1; index >= 0; index--) {\r\n      section = section.slice(0, blocks[index].start) + updates[index] + section.slice(blocks[index].end);\r\n    }\r\n    section = section.replace(/href="https:\\/\\/www\\.awwwards\\.com\\/kota\\/" target="_blank">awwwards<\\/a>/, 'href="https://www.instagram.com/kotalondon/" target="_blank">Instagram</a>');\r\n    section = section.replace(/<span class="FadeIn_container__bjQVL" data-fill="false"><a class="ContactDetails_follow__WB_uR" href="https:\\/\\/clutch\\.co\\/profile\\/kota#highlights" target="_blank">Clutch<\\/a><\\/span>/, '');`;

s = s.replace(oldFollowsRepl, newFollowsRepl);

fs.writeFileSync('src/lib/reference.js', s, 'utf8');
console.log('src/lib/reference.js successfully updated with follows edits!');
