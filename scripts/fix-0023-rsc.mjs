import fs from 'node:fs';

const loc = fs.readFileSync('src/lib/localize.mjs', 'utf8');

// The clean replacement for 0023 RSC
const oldRsc0023 = `["$","div",null,{"className":"Intro_projectDetails__UWcsm","children":[["$","div",null,{"className":"Intro_left__d8bha","children":["$","$L1d",null,{"delay":0.15,"children":[["$","div",null,{"className":"$undefined","children":[["$","p",null,{"className":"Intro_smallHeading__gYXTn","children":"Industry"}],["$","p",null,{"children":"SaaS"}]]}],["$","div",null,{"className":"$undefined","children":[["$","p",null,{"className":"Intro_smallHeading__gYXTn","children":"Location"}],["$","p",null,{"children":"London, UK"}]]}]]}]}],["$","div",null,{"className":"Intro_right__E3UWy","children":["$","$L1d",null,{"delay":0.15,"children":null}]}]]}]`;

const newRsc0023 = `["$","div",null,{"className":"Intro_projectDetails__UWcsm","style":{"gridColumn":"8/span 4"},"children":["$","div",null,{"className":"Intro_left__d8bha","style":{"width":"100%"},"children":["$","$L1d",null,{"delay":0.15,"children":["$","div",null,{"style":{"marginBottom":0},"children":[["$","p",null,{"className":"Intro_smallHeading__gYXTn","style":{"fontWeight":600,"marginBottom":"0.75rem"},"children":"Services & Scope"}],["$","ul",null,{"style":{"listStyle":"none","padding":0,"margin":0,"display":"flex","flexDirection":"column","gap":"0.4rem"},"children":[["$","li","0",{"style":{"display":"flex","alignItems":"center","gap":"0.6rem","fontSize":"1.125rem","lineHeight":1.35},"children":[["$","span",null,{"style":{"display":"inline-block","width":"5px","height":"5px","borderRadius":"50%","backgroundColor":"currentColor","flexShrink":0}}],["$","span",null,{"children":"Website Design & Development"}]]}],["$","li","1",{"style":{"display":"flex","alignItems":"center","gap":"0.6rem","fontSize":"1.125rem","lineHeight":1.35},"children":[["$","span",null,{"style":{"display":"inline-block","width":"5px","height":"5px","borderRadius":"50%","backgroundColor":"currentColor","flexShrink":0}}],["$","span",null,{"children":"Brand Experience"}]]}],["$","li","2",{"style":{"display":"flex","alignItems":"center","gap":"0.6rem","fontSize":"1.125rem","lineHeight":1.35},"children":[["$","span",null,{"style":{"display":"inline-block","width":"5px","height":"5px","borderRadius":"50%","backgroundColor":"currentColor","flexShrink":0}}],["$","span",null,{"children":"Digital Strategy"}]]}]]}]]}]}]}]}]`;

// Remove the temporary replacement lines:
let updated = loc.replace(`text = text.replaceAll('\\"children\\":\\"London, UK\\"', '\\"children\\":\\"Digital Strategy\\"');\n`, '');
updated = updated.replace(`text = text.replaceAll('\\"children\\":\\"SaaS\\"', '\\"children\\":\\"Website Design & Development\\"');\n`, '');

// Add the 0023 RSC replacement directly:
const anchor = `text = text.replaceAll('"title":"Bucher + Suter","slug":"bucher-suter"', '"title":"Seven Gate Holdings","slug":"seven-gate-holdings"');`;

const addition = `${anchor}
  text = text.replaceAll(${JSON.stringify(oldRsc0023)}, ${JSON.stringify(newRsc0023)});`;

updated = updated.replace(anchor, addition);

fs.writeFileSync('src/lib/localize.mjs', updated, 'utf8');
console.log('Cleaned and added exact 0023 RSC details replacement');
