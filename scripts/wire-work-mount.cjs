const fs = require('fs');
let s = fs.readFileSync('src/lib/reference.js', 'utf8');

// 1. Add import
if (!s.includes("import { installWorkArchiveMount } from './work-archive-mount.js';")) {
  s = s.replace(
    "import { installNavigationControls } from './navigation-controls.js';",
    "import { installNavigationControls } from './navigation-controls.js';\r\nimport { installWorkArchiveMount } from './work-archive-mount.js';"
  );
}

// 2. Add to boot script
if (!s.includes("(${installWorkArchiveMount.toString()})();")) {
  s = s.replace(
    "(${installNavigationControls.toString()})();",
    "(${installNavigationControls.toString()})();\r\n(${installWorkArchiveMount.toString()})();"
  );
}

fs.writeFileSync('src/lib/reference.js', s, 'utf8');
console.log('Successfully re-wired installWorkArchiveMount in src/lib/reference.js!');
