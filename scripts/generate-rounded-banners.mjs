import sharp from 'sharp';

async function createBanner(src, dest) {
  const w = 540;
  const h = 958;
  const r = 32;
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white" /></svg>`
  );

  await sharp(src)
    .resize(w, h, { kernel: 'lanczos3' })
    .sharpen({ sigma: 1.0, m1: 1.0, m2: 2.0 })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(dest);
}

async function main() {
  await Promise.all([
    createBanner('public/images/green-square-banner-1.jpg', 'public/images/green-square-banner-1-rounded.png'),
    createBanner('public/images/green-square-banner-2.jpg', 'public/images/green-square-banner-2-rounded.png'),
    createBanner('public/images/green-square-banner-3.jpg', 'public/images/green-square-banner-3-rounded.png'),
  ]);
  console.log('Rounded banners created successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
