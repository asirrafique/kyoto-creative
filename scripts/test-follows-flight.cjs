const fs = require('fs');
const ref = fs.readFileSync('reference/pages/4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993.html', 'utf8');

const parts = [];
ref.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
  let value;
  try { value = JSON.parse(data); } catch { return script; }
  if (value[0] !== 1) return script;
  parts.push(value[1]);
  return '';
});

const text = parts.join('');
const source = Buffer.from(text);
let cursor = 0;
while (cursor < source.length) {
  if (source[cursor] === 10) { cursor++; continue; }
  const colon = source.indexOf(58, cursor);
  if (colon !== -1 && source[colon + 1] === 84) {
    const id = source.subarray(cursor, colon).toString();
    const comma = source.indexOf(44, colon + 2);
    const hex = source.subarray(colon + 2, comma).toString();
    if (/^[a-f\d]+$/i.test(id) && /^[a-f\d]+$/i.test(hex)) {
      const end = comma + 1 + parseInt(hex, 16);
      cursor = end;
      continue;
    }
  }
  const newline = source.indexOf(10, cursor);
  const end = newline === -1 ? source.length : newline + 1;
  const row = source.subarray(cursor, end).toString();
  if (row.startsWith('10:')) {
    const doc = JSON.parse(row.slice(3));

    function updateFollowsFlightNode(node) {
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          const child = node[i];
          if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('ContactDetails_follows__')) {
            console.log('Found ContactDetails_follows in array at index', i);
            // child[3].children is [ [p for heading], [ [link0], [link1], [link2], [link3] ] ]
            const linksArray = child[3].children[1];
            if (Array.isArray(linksArray)) {
              console.log('linksArray initial length:', linksArray.length);
              // Update awwwards to Instagram
              for (const linkWrapper of linksArray) {
                const aTag = linkWrapper && linkWrapper[3] && linkWrapper[3].children;
                if (aTag && aTag[3] && aTag[3].children === 'awwwards') {
                  aTag[3].children = 'Instagram';
                  aTag[3].href = 'https://www.instagram.com/kotalondon/';
                  console.log('Updated awwwards to Instagram!');
                }
              }
              // Remove Clutch
              const clutchIdx = linksArray.findIndex(linkWrapper => {
                const aTag = linkWrapper && linkWrapper[3] && linkWrapper[3].children;
                return aTag && aTag[3] && aTag[3].children === 'Clutch';
              });
              if (clutchIdx !== -1) {
                linksArray.splice(clutchIdx, 1);
                console.log('Removed Clutch at index', clutchIdx);
              }
            }
            return true;
          }
          if (updateFollowsFlightNode(child)) return true;
        }
      } else if (node && typeof node === 'object') {
        for (const key of Object.keys(node)) {
          if (updateFollowsFlightNode(node[key])) return true;
        }
      }
      return false;
    }

    const updated = updateFollowsFlightNode(doc);
    console.log('Follows node updated?', updated);
    console.log('Doc still has Clutch?', JSON.stringify(doc).includes('Clutch'));
    console.log('Doc has Instagram?', JSON.stringify(doc).includes('Instagram'));
  }
  cursor = end;
}
