const fs = require('fs');
const path = 'public/__static/9cfad8ff08358585/__assets/kota.co.uk/_next/static/chunks/2117-ba8bcf71fc4483a9.js';
let content = fs.readFileSync(path, 'utf8');

const target = 'if(null===e)throw Error("invariant expected app router to be mounted");return e';
console.log('Target found:', content.includes(target));
if (content.includes(target)) {
  const replacement = 'if(null===e)return {push:function(url){window.location.href=url},replace:function(url){window.location.href=url},prefetch:function(){},back:function(){window.history.back()},forward:function(){window.history.forward()},refresh:function(){}};return e';
  content = content.replace(target, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully patched AppRouterContext mock fallback!');
}
