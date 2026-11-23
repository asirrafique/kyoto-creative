import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
// Some deployment adapters inspect next.config before invoking the build script.
if (!fs.existsSync('reference/static-assets.json')) {
  execFileSync(process.execPath, ['scripts/prepare-assets.mjs'], { stdio: 'inherit' });
}
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
    return {
      beforeFiles: [
        // 1. Captured replica assets requested by captured pages with ?replica=
        {
          source: '/_next/static/:asset*',
          has: [{ type: 'query', key: 'replica' }],
          destination: prefix + '/__assets/kota.co.uk/_next/static/:asset*',
        },
        // 2. Captured CSS stylesheets (named as [0-9a-f]{16}.css)
        {
          source: '/_next/static/css/:hash([0-9a-f]{16}\\.css)',
          destination: prefix + '/__assets/kota.co.uk/_next/static/css/:hash',
        },
        // 3. Captured media assets (fonts, woff2, noise textures)
        {
          source: '/_next/static/media/:asset*',
          destination: prefix + '/__assets/kota.co.uk/_next/static/media/:asset*',
        },
        // 4. Captured Next image optimizer
        { source: '/_next/image', destination: '/__assets/kota.co.uk/_next/image' },
        // 5. Captured third-party and cdn assets
        { source: '/__assets/:asset*', destination: prefix + '/__assets/:asset*' },
      ],
      fallback: [
        // Catch-all fallback for any remaining captured assets without intercepting Studio/internal chunks
        { source: '/_next/static/:asset*', destination: prefix + '/__assets/kota.co.uk/_next/static/:asset*' },
      ],
    };
  },
};
export default config;
