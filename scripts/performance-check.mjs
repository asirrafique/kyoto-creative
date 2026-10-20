import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const origin = process.env.REPLICA_URL || 'http://127.0.0.1:3101';
const manifest = JSON.parse(await fs.readFile('reference/static-assets.json', 'utf8'));
const index = JSON.parse(await fs.readFile('reference/assets.json', 'utf8'));
const checks = [];
function check(name, pass, detail) { checks.push({ name, pass, detail }); assert.ok(pass, name); }
function atoms(buffer) {
  const result = [];
  for (let position = 0; position + 8 <= buffer.length;) {
    let size = buffer.readUInt32BE(position);
    if (size === 1) size = Number(buffer.readBigUInt64BE(position + 8));
    if (!size) size = buffer.length - position;
    result.push({ type: buffer.toString('ascii', position + 4, position + 8), position, size });
    position += size;
  }
  return result;
}
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
let videos = 0, moved = 0;
for (const [name, publicPath] of Object.entries(manifest.files)) {
  if (!name.endsWith('.mp4')) continue;
  const before = await fs.readFile(path.join('reference/assets', name));
  const after = await fs.readFile(path.join('public', publicPath));
  const old = atoms(before), next = atoms(after);
  const oldMedia = old.filter(x => x.type === 'mdat'), newMedia = next.filter(x => x.type === 'mdat');
  assert.equal(oldMedia.length, newMedia.length);
  for (let i = 0; i < oldMedia.length; i++) {
    assert.equal(hash(before.subarray(oldMedia[i].position, oldMedia[i].position + oldMedia[i].size)),
      hash(after.subarray(newMedia[i].position, newMedia[i].position + newMedia[i].size)), 'Encoded video/audio must be unchanged');
  }
  assert.ok(next.find(x => x.type === 'moov').position < next.find(x => x.type === 'mdat').position);
  if (old.find(x => x.type === 'moov').position > oldMedia[0].position) moved++;
  videos++;
}
check('All MP4s have fast-start metadata and unchanged encoded media', videos > 0, { videos, moved });
const tracing = JSON.parse(await fs.readFile('.next/server/app/[[...path]]/route.js.nft.json', 'utf8'));
check('Function bundle excludes media and public static files', !tracing.files.some(x => /reference\/assets\/|public\/__static\//.test(x)), { files: tracing.files.length });
for (const name of ['Short-Preview-homepage.mp4', '00-Kota-Showreel-2025-Final.mp4']) {
  const upstream = Object.keys(index).find(url => url.endsWith('/' + name));
  const url = new URL(upstream);
  const response = await fetch(origin + '/__assets/' + url.hostname + url.pathname, { headers: { Range: 'bytes=0-99' } });
  check(name + ' is served directly as static partial content', response.status === 206 && (await response.arrayBuffer()).byteLength === 100 && response.headers.has('last-modified'), Object.fromEntries(response.headers));
}
const staticPath = Object.values(manifest.files).find(x => x.endsWith('.woff2'));
const response = await fetch(origin + staticPath, { method: 'HEAD' });
check('Versioned static assets have immutable caching', response.ok && /31536000.*immutable/.test(response.headers.get('cache-control')));
const html = await fetch(origin + '/');
const flight = await fetch(origin + '/', { headers: { RSC: '1' } });
check('HTML and Flight retain distinct content types', html.headers.get('content-type').includes('text/html') && flight.headers.get('content-type').includes('text/x-component'));
await fs.writeFile('reports/performance-verification.json', JSON.stringify({ checks }, null, 2));
console.log(JSON.stringify({ checks }, null, 2));
