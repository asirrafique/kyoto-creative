import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { localize } from '../src/lib/localize.mjs';
import { fastStart } from './mp4-faststart.mjs';

// Run before Next builds so public media is deployed as static CDN output,
// rather than being traced into (and streamed through) a server function.
const source = 'reference/assets';
const index = JSON.parse(await fs.readFile('reference/assets.json', 'utf8'));
const entries = (await fs.readdir(source)).sort();
const versionHash = crypto.createHash('sha256');
function transform(name, data) {
  if (/\.(js|css|svg)$/.test(name)) return Buffer.from(localize(data.toString()));
  if (name.endsWith('.mp4')) return fastStart(data);
  return data;
}
const locations = new Map();
for (const [url, filename] of Object.entries(index)) {
  const parsed = new URL(url);
  const relative = '__assets/' + parsed.hostname + decodeURI(parsed.pathname);
  if (relative.split('/').includes('..')) throw new Error('Invalid asset path');
  const name = path.basename(filename);
  if (!locations.has(name)) locations.set(name, []);
  locations.get(name).push(relative);
}
for (const name of entries) {
  const data = await fs.readFile(path.join(source, name));
  const text = transform(name, data);
  versionHash.update(name).update(crypto.createHash('sha256').update(text).digest());
}
versionHash.update(JSON.stringify(index));
const version = versionHash.digest('hex').slice(0, 16);
const prefix = '/__static/' + version;
const directory = path.join('public', prefix);
const files = {};
let bytes = 0;
for (const name of entries) {
  const targets = locations.get(name) || ['__files/' + name];
  files[name] = prefix + '/' + targets[0];
  for (const target of new Set(targets)) {
    const destination = path.join(directory, target);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    if (/\.(js|css|svg|mp4)$/.test(name)) await fs.writeFile(destination, transform(name, await fs.readFile(path.join(source, name))));
    else await fs.copyFile(path.join(source, name), destination);
  }
  bytes += (await fs.stat(path.join(source, name))).size;
}
await fs.writeFile('reference/static-assets.json', JSON.stringify({ version, prefix, files }));
const staticRoot = path.resolve('public/__static');
for (const old of await fs.readdir(staticRoot)) {
  const target = path.resolve(staticRoot, old);
  if (/^[a-f0-9]{16}$/.test(old) && old !== version && path.dirname(target) === staticRoot) {
    await fs.rm(target, { recursive: true, force: true });
  }
}
console.log(`Prepared ${entries.length} static assets (${(bytes / 1024 ** 2).toFixed(1)} MB), version ${version}`);
