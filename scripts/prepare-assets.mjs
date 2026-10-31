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
  if (/\.(js|css|svg)$/.test(name)) {
    let text = localize(data.toString());
    if (name === '69be6789bb3fa7e7dfc8ec4579c77f5cfa4478c0f7618111f58745afa6a847d2.js') {
      const current = 'd.u=function(e){return"static/chunks/"+(({1733:"0b60df10",8734:"a0e187c9",8943:"8627a13e"})[e]||e)+"."+({438:"e6fbe955f27adf44",869:"24611aecef24470f",1733:"f6af8aa88104e378",6568:"c2ba7034c2da9604",8040:"478db8e9289add62",8303:"e288842e5b3f3e28",8310:"20377cd0d444c913",8734:"e2d128d208f66e2f",8943:"4b33fc07b2048edf"})[e]+".js"}';
      const repaired = 'd.u=function(e){return 2971===e?"static/chunks/fd9d1056-2f07626ddf804ce1.js":"static/chunks/"+(({1733:"0b60df10",8734:"a0e187c9",8943:"8627a13e"})[e]||e)+"."+({438:"e6fbe955f27adf44",869:"24611aecef24470f",1733:"f6af8aa88104e378",6568:"c2ba7034c2da9604",8040:"478db8e9289add62",8303:"e288842e5b3f3e28",8310:"20377cd0d444c913",8734:"e2d128d208f66e2f",8943:"4b33fc07b2048edf"})[e]+".js"}';
      if (!text.includes(current)) throw new Error('Expected webpack chunk mapping was not found');
      text = text.replace(current, repaired);
    }
    if (name === '657ae10a235cf02136ee3d09790fbb4892e36ccda9944091d06c495f791c61a1.js') {
      const current = 'case 2:case 3:case 5:break;default:throw Error(i(329))';
      const repaired = 'case 2:case 3:case 5:case 6:break;default:throw Error(i(329))';
      if (!text.includes(current)) throw new Error('Expected React render-status switch was not found');
      text = text.replace(current, repaired);
      const hydrationCheck = 'function t8(e){return 0!=(1&e.mode)&&0==(128&e.flags)}';
      if (!text.includes(hydrationCheck)) throw new Error('Expected React hydration check was not found');
      text = text.replace(hydrationCheck, 'function t8(e){return false}');
    }
    return Buffer.from(text);
  }
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
