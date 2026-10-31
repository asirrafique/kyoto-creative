const fs = require('fs');

const part = fs.readFileSync('temp_seven_gate_part.html', 'utf8');

for (const file of ['reference/pages/leadcourt_project_page.html', 'reference/pages/bankrate_project_page.html']) {
  let html = fs.readFileSync(file, 'utf8');

  const target = 'expand the user base.</p>\n</div></span></div></div></section>';
  if (html.includes(target)) {
    html = html.replace(target, target + '\n' + part);
    fs.writeFileSync(file, html, 'utf8');
    console.log('Inserted part successfully into:', file);
  } else {
    console.log('target not found in:', file);
  }
}
