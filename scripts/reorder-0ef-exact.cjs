const fs = require('fs');

let html = fs.readFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', 'utf8');

// Find the push with 35:I[57372 and 34:
const s35 = '<script>self.__next_f.push([1,"35:I[57372,[\"922\",\"static/chunks/c15bf2b0-7fe4609d5aed7ee2.js\",\"6689\",\"static/chunks/b536a0f1-48e07d9a196acd0d.js\",\"1550\",\"static/chunks/1550-75709fc12a079aa2.js\",\"1242\",\"static/chunks/1242-b8f16838e7608b53.js\",\"9498\",\"static/chunks/9498-3112cb2861cfba50.js\",\"4143\",\"static/chunks/4143-6b83e17252ec01c2.js\",\"988\",\"static/chunks/988-86d1af1c6c90b59b.js\",\"2798\",\"static/chunks/app/work/%5Bslug%5D/page-52a6fe0f49fb5a18.js\"],\"default\"]\n34:[\"$\",\"section\",null,{\"className\":\"LargeCta_largeCta__ylf5C\",\"children\":[[\"$\",\"$L1c\",null,{}],[\"$\",\"div\",null,{\"className\":\"container\",\"children\":[\"$\",\"div\",null,{\"className\":\"LargeCta_inner__QmWie\",\"children\":[[\"$\",\"div\",null,{\"className\":\"LargeCta_left__YQVnr\",\"children\":[false,false,[\"$\",\"p\",null,{\"className\":\"LargeCta_mainHeading__IirAl\",\"children\":[\"$\",\"$L28\",null,{\"children\":[\"$\",\"span\",null,{\"children\":\"Have a new project you\'d like help with?\"}]}]}]]}],[\"$\",\"div\",null,{\"className\":\"LargeCta_right__5bEnD\",\"children\":[\"$\",\"$L2a\",null,{\"children\":[\"$\",\"div\",null,{\"className\":\"LargeCta_buttonContainer__26iG0\",\"children\":[\"$\",\"$L35\",null,{\"children\":[\"$\",\"$L22\",null,{\"href\":\"/start-your-project\",\"className\":\"LargeCta_popupButton__ia_FB\",\"children\":[[\"$\",\"span\",null,{\"children\":[\"Let\'s get \",[\"$\",\"em\",null,{\"children\":\"started\"}]]}],[\"$\",\"figure\",null,{\"className\":\"LargeCta_border__Ed4lN\"}],[\"$\",\"figure\",null,{\"className\":\"LargeCta_buttonBackground__Pfa3U\"}]]}]}]}]}]}]]}]}],[\"$\",\"$L1e\",null,{\"scrollTrigger\":false,\"variation\":5,\"darkBackground\":true,\"position\":\"absolute\",\"noise\":false}]]}]\n"])</script>';

console.log('s35 found in html:', html.includes(s35));

const treeStart = '<script>self.__next_f.push([1,"e:[[[';
console.log('treeStart found in html:', html.includes(treeStart));

if (html.includes(s35) && html.includes(treeStart)) {
  html = html.replace(s35, '');
  html = html.replace(treeStart, s35 + '\n' + treeStart);
  fs.writeFileSync('reference/pages/0ef3d4e5dda32481020981cefd2000c47a2aeb243e38b7efd3d6d03c60178b84.html', html, 'utf8');
  console.log('Successfully re-ordered s35 immediately before treeStart!');
}
