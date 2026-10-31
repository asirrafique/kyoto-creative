import http from 'node:http';

http.get('http://127.0.0.1:3000/agency', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP GET /agency length:', data.length);
    console.log('Contains ["$,null?:', data.indexOf('["$",null'));
    if (data.indexOf('["$",null') !== -1) {
      const idx = data.indexOf('["$",null');
      console.log('Snippet in HTTP GET:\n', data.slice(idx - 60, idx + 60));
    }
  });
});
