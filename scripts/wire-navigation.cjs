const fs = require('fs');
let ref = fs.readFileSync('src/lib/reference.js', 'utf8');

const targetImport = "import { installLinkControls } from './link-controls.js';";
const newImport = "import { installLinkControls } from './link-controls.js';\nimport { installNavigationControls } from './navigation-controls.js';";

const targetBoot = "(${installLinkControls.toString()})();";
const newBoot = "(${installLinkControls.toString()})();\n(${installNavigationControls.toString()})();";

if (ref.includes(targetImport) && ref.includes(targetBoot)) {
  ref = ref.replace(targetImport, newImport).replace(targetBoot, newBoot);
  fs.writeFileSync('src/lib/reference.js', ref, 'utf8');
  console.log('Successfully wired installNavigationControls into reference.js');
} else {
  console.error('Could not find target strings in reference.js');
}
