const bentoStr = '["$","$L2c",null,{"delay":1';
const reg = /,(?:\\{1,3}"\$L(?:57|46|2c)\\{1,3}"|"\$L(?:57|46|2c)")/g;
console.log('Match in bentoStr:', bentoStr.match(reg));

const bentoStr2 = '["children":["$","$L2c",null,{"delay":1}]]';
console.log('Match in bentoStr2:', bentoStr2.match(reg));

// What about in raw serialized flight stream:
const flightSample = '["$","$L2c",null,{"delay":1';
console.log('Flight match:', flightSample.match(reg));
// If Bento has `["$","$L2c"`, there is no leading comma before `"$L2c"`.
// But what about: `["$","div",null,{"className":"container","children":["$","$L2c",null,{"delay":1...`
// In Bento:
// "children": ["$", "$L2c", null, ...] -> `["$","$L2c",null`
// Does it match `,` + `"$L2c"`?
// No, because it starts with `["$"` then comma then `"$L2c"`!
// Wait! `["$","$L2c"` -> THERE IS A COMMA BEFORE `"$L2c"`!
console.log('Match in [\\"$\\",\\"$L2c\\":', '["$","$L2c",null]'.match(reg));
