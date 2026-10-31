const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

// Search for crosshair in ref
let pos = 0;
while ((pos = ref.indexOf('crosshair', pos)) !== -1) {
  console.log('Found crosshair at:', pos);
  console.log(ref.slice(pos - 40, pos + 80));
  pos += 9;
}
