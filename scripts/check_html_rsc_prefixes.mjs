import fs from 'fs';

const pages = [
  '8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1',
  '4eb950636535d637ee743743cfbc75724f464688f94a426d3dedea4097aeb993',
  '3f750c643c261e6a46c3c1472f69cf02af572051b67c43ee4fd6309d45001c0e',
  '6b3a02b352c47a36abd53f5f1e6d89b23786e4e144d5154c49cf38e1e9b391b3',
  '96eb531169d79caaa76b97128d327f181082c982b38d933286031d6cfff5605e',
  'df742066764f68193a0c91081b97daefb4d73613119ac7e632cd0250810558b8',
  'f76164aabffcfc394ce77baacd04247c1fe0f3ec66b8f77688c8d9ce55fdf084'
];

for (const name of pages) {
  const html = fs.readFileSync('reference/pages/' + name + '.html', 'utf8');
  // Find where $L... is followed by the next section or preceded by the previous section in children array
  const m = html.match(/,\\"(\$L[0-9a-fA-F]+)\\",\[\\"\\$\\/);
  // Let's search for the pattern around kotaverceCta in the tree
  const idx = html.indexOf('kotaverceCta');
  const rscIdx = html.indexOf(':[\"$\",\"section\",null,{\"className\":\"KotaverseCta_kotaverseCta');
  console.log(name, 'rscIdx:', rscIdx);
  if (rscIdx !== -1) {
    const chunk = html.slice(rscIdx - 10, rscIdx);
    console.log(name, 'row prefix:', JSON.stringify(chunk));
  }
}
