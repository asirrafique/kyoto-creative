const fs = require('fs');
const ref = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

// Find all occurrences of null in elements where React expects a valid React component or element type
// In React 130: "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: null"
// In Flight format, an element is ["$", ElementType, key, props]
// If ElementType is null, e.g. ["$", null, ...] or ["$", "$Lxx", null, props] where $Lxx resolves to null or undefined!
// Let's check which $Lxx modules are referenced in the agency flight stream!

const match = ref.match(/self\.__next_f\.push\((\[[\s\S]*?\])\)/g);
console.log('Matches count:', match ? match.length : 0);
for (const m of match) {
  if (m.includes('AppRouter') || m.includes('$L')) {
    // console.log
  }
}
