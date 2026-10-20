import fs from 'node:fs';
const { prefix } = JSON.parse(fs.readFileSync('reference/static-assets.json', 'utf8'));
/** Keep captured assets on the static CDN, outside the server function. */
const config = {
  poweredByHeader: false,
  outputFileTracingExcludes: { '/*': ['./reference/assets/**/*', './public/**/*', './intern/**/*', './reports/**/*'] },
  async headers() {
    return [
      { source: '/__static/:asset*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/__assets/:asset*', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }] },
    ];
  },
  async rewrites() {
    return { beforeFiles: [
      { source: '/_next/static/:asset*', destination: prefix + '/__assets/kota.co.uk/_next/static/:asset*' },
      { source: '/_next/image', destination: '/__assets/kota.co.uk/_next/image' },
      { source: '/__assets/:asset*', destination: prefix + '/__assets/:asset*' },
    ] };
  },
};
export default config;
