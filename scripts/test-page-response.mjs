import { documentResponse } from '../src/lib/reference.js';

const req = new Request('http://localhost:3000/agency');
const res = await documentResponse(req, '/agency');
const text = await res.text();
console.log('documentResponse length:', text.length);
console.log('Contains ["$,null?:', text.includes('["$",null'));
if (text.includes('["$",null')) {
  const idx = text.indexOf('["$",null');
  console.log('Snippet in documentResponse:\n', text.slice(idx - 60, idx + 100));
}
