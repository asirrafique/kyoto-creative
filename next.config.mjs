/** Keep the captured frontend's build isolated from this Next.js host's build. */
const config = {
  poweredByHeader: false,
  async rewrites() {
    return { beforeFiles: [
      { source: '/_next/static/:asset*', destination: '/__assets/kota.co.uk/_next/static/:asset*' },
      { source: '/_next/image', destination: '/__assets/kota.co.uk/_next/image' },
    ] };
  },
};
export default config;
