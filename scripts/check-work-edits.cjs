const fs = require('fs');

const html = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.html', 'utf8');

// Find all occurrences of 88pilot, seven-gate, bucher-suter, green-square
console.log('88pilot in work html?', html.includes('88pilot'));
console.log('seven-gate in work html?', html.includes('seven-gate'));
console.log('bucher-suter in work html?', html.includes('bucher-suter'));
console.log('green-square in work html?', html.includes('green-square'));
console.log('upp in work html?', html.includes('upp'));

const rsc = fs.readFileSync('reference/pages/0c9a453fad615c83c57d57c2b2be05fa938f0791d7624db43827a033227bf78b.rsc', 'utf8');
console.log('88pilot in work rsc?', rsc.includes('88pilot'));
console.log('seven-gate in work rsc?', rsc.includes('seven-gate'));
console.log('bucher-suter in work rsc?', rsc.includes('bucher-suter'));
console.log('green-square in work rsc?', rsc.includes('green-square'));
console.log('upp in work rsc?', rsc.includes('upp'));
