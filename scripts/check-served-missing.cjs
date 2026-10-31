const http = require('http');

http.get('http://127.0.0.1:3000/work/green-square-infra', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const scripts = [...data.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
    const content = scripts[18][1];
    const parsed = JSON.parse(content.replace(/^self\.__next_f\.push\(/, '').replace(/\)$/, ''));
    const str = parsed[1];
    
    const defMatches = [...str.matchAll(/([0-9a-f]+):I\[/g)];
    const definedIds = new Set(defMatches.map(m => m[1]));
    
    const treeIdx = str.indexOf('e:[[[');
    const tree = str.slice(treeIdx);
    
    const usedL = [...tree.matchAll(/"\$L([0-9a-f]+)"/g)].map(m => m[1]);
    const missing = [...new Set(usedL)].filter(id => !definedIds.has(id));
    console.log('Defined IDs count:', definedIds.size);
    console.log('Used $L count:', new Set(usedL).size);
    console.log('MISSING in served flight stream:', missing);
  });
});
