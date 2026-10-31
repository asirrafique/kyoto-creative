import http from 'node:http';

http.get('http://127.0.0.1:3000/agency', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('2c:I in HTTP response?:', data.indexOf('2c:I'));
    console.log('$L2c in HTTP response?:', data.indexOf('$L2c'));
    if (data.indexOf('$L2c') !== -1) {
      const idx = data.indexOf('$L2c');
      console.log('$L2c snippet in HTTP response:\n', data.slice(idx - 30, idx + 60));
    }
  });
});
