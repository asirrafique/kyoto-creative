const fs = require('fs');
const html = fs.readFileSync('reference/pages/green_square_infra_project_page.html', 'utf8');

const pushes = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*"(.*?)"\]\)/gs)];
pushes.forEach((p, idx) => {
  const content = p[1];
  if (content.startsWith('e:')) {
    console.log('e push found at index', idx, 'length:', content.length);
    console.log('Includes Intro_intro:', content.includes('Intro_intro'));
    console.log('Includes Industry:', content.includes('Industry'));
    console.log('Includes A website worthy:', content.includes('A website worthy'));
    console.log('Includes Cinematic storytelling:', content.includes('Cinematic storytelling'));
  }
  if (content.includes('Industry')) {
    console.log('Push', idx, 'contains Industry');
  }
  if (content.includes('A website worthy')) {
    console.log('Push', idx, 'contains A website worthy');
  }
});
