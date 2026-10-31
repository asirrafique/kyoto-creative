import fs from 'node:fs';
import { localize } from '../src/lib/localize.mjs';

const agencyHtml = fs.readFileSync('reference/pages/3fe9f8a2dc6b57114450b461e3849bd9194b55622fba993ea04816be440624c5.html', 'utf8');

// Test with original localize
const test1 = localize(agencyHtml);
console.log('Original localize agency has ["$,null?:', test1.includes('["$",null'));

// Now let's test with line 128 modified:
// Instead of blindly stripping ,"$L2c" everywhere, ONLY strip ,"$L2c" if text actually contains KotaverseCta!
// Or only strip ,"$L57", ,"$L46", ,"$L1c" (which are KotaverseCta), while on contact page we already handled KotaverseCta or only when followed/preceded by Kotaverse!
