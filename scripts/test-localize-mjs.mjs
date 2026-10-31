import { localize } from '../src/lib/localize.mjs';

const testStr = '34:["$","section",null,{"className":"LargeCta_largeCta__ylf5C","children":[["$","$L1c",null,{}],["$","div",null,{"className":"con';
console.log('Original:', testStr);
console.log('Localized:', localize(testStr));
