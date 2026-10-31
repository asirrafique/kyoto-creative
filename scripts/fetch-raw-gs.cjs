const http = require('http');

http.get('http://127.0.0.1:3000/work/green-square-infra', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('GS status:', res.statusCode);
    console.log('GS length:', body.length);
    console.log('GS title:', body.match(/<title>(.*?)<\/title>/)?.[1]);
    console.log('GS h1:', body.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]);
  });
});
