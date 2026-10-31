const fs = require('fs');

const { results, impact, quote } = JSON.parse(fs.readFileSync('scripts/seven_gate_3_nodes.json', 'utf8'));

function updatePage(pagePath) {
  let html = fs.readFileSync(pagePath, 'utf8');

  // Find the ContentBuilder next_f script
  const scriptRegex = /self\.__next_f\.push\(\[(\d+),([\s\S]*?)\]\)/g;
  let match;
  let targetMatch = null;
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[2].includes('ContentBuilder_contentBuilder')) {
      targetMatch = match;
    }
  }

  if (!targetMatch) {
    throw new Error('ContentBuilder script not found in ' + pagePath);
  }

  const rawArg1 = targetMatch[1];
  const parsedArg2 = JSON.parse(targetMatch[2]);
  const colonIdx = parsedArg2.indexOf(':');
  const prefix = parsedArg2.slice(0, colonIdx + 1);
  const tree = JSON.parse(parsedArg2.slice(colonIdx + 1));

  function findContentBuilder(node) {
    if (!node) return null;
    if (Array.isArray(node)) {
      if (node[0] === '$' && node[3] && typeof node[3].className === 'string' && node[3].className.includes('ContentBuilder_contentBuilder')) {
        return node;
      }
      for (const item of node) {
        const res = findContentBuilder(item);
        if (res) return res;
      }
    } else if (typeof node === 'object') {
      for (const key of Object.keys(node)) {
        const res = findContentBuilder(node[key]);
        if (res) return res;
      }
    }
    return null;
  }

  const cb = findContentBuilder(tree);
  if (!cb) {
    throw new Error('CB node not found in tree');
  }

  console.log(pagePath, 'Initial CB children count:', cb[3].children.length);

  // If already appended, keep only first 4 children
  if (cb[3].children.length > 4) {
    cb[3].children = cb[3].children.slice(0, 4);
  }

  // Append results, impact, quote
  cb[3].children.push(results);
  cb[3].children.push(impact);
  cb[3].children.push(quote);

  console.log(pagePath, 'New CB children count:', cb[3].children.length);

  // Re-encode tree
  const newArg2Str = prefix + JSON.stringify(tree);
  const newPush = 'self.__next_f.push([' + rawArg1 + ',' + JSON.stringify(newArg2Str) + '])';

  html = html.replace(targetMatch[0], newPush);

  // Ensure DOM HTML has the 3 sections in temp_seven_gate_part.html
  const tempPart = fs.readFileSync('temp_seven_gate_part.html', 'utf8').trim();

  // If tempPart is already in DOM, let's verify where it is
  if (!html.includes('Results 30 days post-launch')) {
    // Insert after "The Results" section in DOM
    const needle = 'product awareness and expand the user base.</p>\n</div></span></div></div></section>';
    if (html.includes(needle)) {
      html = html.replace(needle, needle + '\n' + tempPart);
      console.log('Inserted DOM snippet after The Results');
    } else {
      console.log('Needle not found for DOM insertion!');
    }
  } else {
    console.log('DOM already contains Results 30 days post-launch');
  }

  fs.writeFileSync(pagePath, html, 'utf8');
  console.log('Updated', pagePath);
}

updatePage('reference/pages/leadcourt_project_page.html');
updatePage('reference/pages/bankrate_project_page.html');
