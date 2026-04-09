import https from 'https';

const req = https.get('https://portfolio-xi-ten-92.vercel.app/anthropic-certificate.jpg', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.setTimeout(5000, () => {
  req.destroy();
});
