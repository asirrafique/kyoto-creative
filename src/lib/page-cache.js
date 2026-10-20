import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';

const directory = path.join(process.cwd(), 'reference/pages');
const inflight = new Map();
const indexes = new Map();

/** Internal Next cache-busters and marketing parameters do not identify content. */
export function pageKey(route, search) {
  const params = new URLSearchParams(search);
  for (const name of [...params.keys()]) {
    if (name === '_rsc' || name.startsWith('utm_') || ['gclid', 'fbclid'].includes(name)) params.delete(name);
  }
  params.sort();
  return route + (params.size ? '?' + params.toString() : '');
}

export async function readIndex(name) {
  if (process.env.NODE_ENV === 'production' && indexes.has(name)) return indexes.get(name);
  try {
    const value = JSON.parse(await fs.readFile(path.join(process.cwd(), 'reference', name), 'utf8'));
    if (process.env.NODE_ENV === 'production') indexes.set(name, value);
    return value;
  }
  catch (error) { if (error.code === 'ENOENT') return {}; throw error; }
}

/** Fetch public GET content only, to support unenumerated filter combinations. */
export async function capturePage(key) {
  if (key.length > 12000 || !key.startsWith('/') || key.startsWith('//')) return { status: 400 };
  if (inflight.has(key)) return inflight.get(key);
  const operation = (async () => {
    const filename = crypto.createHash('sha256').update(key).digest('hex') + '.html';
    let captureDirectory = directory;
    let htmlPath = path.join(directory, filename);
    try {
      await fs.access(htmlPath);
      await fs.access(htmlPath.replace('.html', '.rsc'));
      return { status: 200, filename };
    } catch { /* Capture a previously unvisited public variant once. */ }
    // Vercel's deployment filesystem is read-only. Uncaptured variants use /tmp.
    if (process.env.VERCEL) {
      captureDirectory = path.join(os.tmpdir(), 'kota-pages');
      htmlPath = path.join(captureDirectory, filename);
      try {
        await fs.access(htmlPath);
        await fs.access(htmlPath.replace('.html', '.rsc'));
        return { status: 200, filename, directory: captureDirectory };
      } catch { /* First request on this instance. */ }
    }
    const url = new URL(key, 'https://kota.co.uk');
    if (url.origin !== 'https://kota.co.uk') return { status: 400 };
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45000), redirect: 'follow' });
      if (!response.ok) return { status: response.status };
      const final = new URL(response.url);
      if (final.origin !== 'https://kota.co.uk' || !response.headers.get('content-type')?.includes('text/html')) return { status: 404 };
      const finalKey = pageKey(final.pathname.replace(/\/$/, '') || '/', final.search);
      if (finalKey !== key) return { status: 307, redirect: finalKey };
      const flightUrl = new URL(url);
      flightUrl.searchParams.set('_rsc', 'replica');
      const flight = await fetch(flightUrl, { headers: { RSC: '1' }, signal: AbortSignal.timeout(45000) });
      if (!flight.ok || !flight.headers.get('content-type')?.includes('text/x-component')) return { status: 502 };
      await fs.mkdir(captureDirectory, { recursive: true });
      await fs.writeFile(htmlPath, await response.text());
      await fs.writeFile(htmlPath.replace('.html', '.rsc'), await flight.text());
      return { status: 200, filename, directory: captureDirectory };
    } catch { return { status: 503 }; }
  })();
  inflight.set(key, operation);
  try { return await operation; } finally { inflight.delete(key); }
}
