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
    console.log('Parsed doc from row 10 successfully! IsArray:', Array.isArray(doc));

    function removeAddressesFlightNode(node) {
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          const child = node[i];
          if (Array.isArray(child) && child[0] === '$' && child[3]?.className?.startsWith('ContactDetails_addresses__')) {
            console.log('Found ContactDetails_addresses in array at index', i);
            node.splice(i, 1);
            return true;
          }
          if (removeAddressesFlightNode(child)) return true;
        }
      } else if (node && typeof node === 'object') {
        for (const key of Object.keys(node)) {
          if (removeAddressesFlightNode(node[key])) return true;
        }
      }
      return false;
    }

    const removed = removeAddressesFlightNode(doc);
    console.log('Removed:', removed);
    console.log('Still has addresses?', JSON.stringify(doc).includes('ContactDetails_addresses__'));
  }
  cursor = end;
}
