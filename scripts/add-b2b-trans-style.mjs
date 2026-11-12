import fs from 'fs';

let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const oldCode = `  const b2bTechPageStyle = (route === '/b2b-tech-software-saas' || route === '/b2b-tech-software-saas/')`;
const newCode = `  const b2bTechPageStyle = (route === '/b2b-tech-software-saas' || route === '/b2b-tech-software-saas/' || route === '/b2b-transformation' || route === '/b2b-transformation/')`;

if (ref.includes(oldCode)) {
  ref = ref.replace(oldCode, newCode);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully added /b2b-transformation to b2bTechPageStyle in reference.js!');
} else {
  console.error('oldCode not found');
}
