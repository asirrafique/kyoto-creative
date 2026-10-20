import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { installHeroVideoControls } from './hero-video';
import { installFaqControls } from './faq-controls';
import { installLinkControls } from './link-controls';
import { capturePage, pageKey, readIndex } from './page-cache';

import { localize } from './localize.mjs';
export { localize } from './localize.mjs';
const root = process.cwd();
/** Flight text rows carry UTF-8 byte lengths, not newline-delimited JSON. */
export function localizeFlight(text) {
  const source = Buffer.from(text);
  const rows = [];
  let cursor = 0;
  while (cursor < source.length) {
    const colon = source.indexOf(58, cursor);
    if (colon !== -1 && source[colon + 1] === 84) {
      const id = source.subarray(cursor, colon).toString();
      const comma = source.indexOf(44, colon + 2);
      const hex = source.subarray(colon + 2, comma).toString();
      if (/^[a-f\d]+$/i.test(id) && /^[a-f\d]+$/i.test(hex)) {
        const end = comma + 1 + parseInt(hex, 16);
        const value = localize(source.subarray(comma + 1, end).toString());
        rows.push(id + ':T' + Buffer.byteLength(value).toString(16) + ',' + value);
        cursor = end;
        continue;
      }
    }
    const newline = source.indexOf(10, cursor);
    const end = newline === -1 ? source.length : newline + 1;
    rows.push(localize(source.subarray(cursor, end).toString()));
    cursor = end;
  }
  return rows.join('');
}

function localizeDocument(html) {
  const parts = [];
  const placeholder = '<!--replica-flight-stream-->';
  let first = true;
  html = html.replace(/<script[^>]*>\s*self\.__next_f\.push\((\[[\s\S]*?\])\)\s*<\/script>/g, (script, data) => {
    let value;
    try { value = JSON.parse(data); } catch { return script; }
    if (value[0] !== 1) return script;
    parts.push(value[1]);
    const result = first ? placeholder : '';
    first = false;
    return result;
  });
  html = localize(html);
  if (parts.length) {
    const data = JSON.stringify([1, localizeFlight(parts.join(''))]).replaceAll('<', '\\u003c');
    html = html.replace(placeholder, '<script>self.__next_f.push(' + data + ')</script>');
  }
  return html;
}

const rendered = new Map();
async function memoize(key, render) {
  if (!key) return render();
  if (rendered.has(key)) return rendered.get(key);
  const pending = render();
  rendered.set(key, pending);
  // Bound warm-instance memory; do not retain all 335 documents and streams.
  if (rendered.size > 64) rendered.delete(rendered.keys().next().value);
  try { return await pending; } catch (error) { rendered.delete(key); throw error; }
}

const boot = `<script data-replica-runtime>
(${installHeroVideoControls.toString()})();
(${installFaqControls.toString()})();
(${installLinkControls.toString()})();
(() => {
  // Scroll-triggered videos may leave the viewport while play() is pending.
  // A browser AbortError in that case is expected and must not become an
  // unhandled rejection; retain real decoding/network failures.
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function() {
    const pending = play.call(this);
    return pending && pending.catch(error => { if (error.name !== 'AbortError') throw error; });
  };
  // Keep marketing analytics from sending replica visitors to the original account.
  const append = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    if (node.tagName === 'SCRIPT' && /googletagmanager|google-analytics|vercel.live/.test(node.src)) return node;
    return append.call(this, node);
  };
})();
</script>`;

export async function documentResponse(request, route) {
  const routes = await readIndex('routes.json');
  route = route.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const key = pageKey(route, new URL(request.url).search);
  const redirects = await readIndex('redirects.json');
  if (redirects[key]) return Response.redirect(new URL(redirects[key], request.url), 307);
  const variants = await readIndex('variants.json');
  let file = key === route ? routes[route] : variants[key];
  let directory = path.join(root, 'reference/pages');
  const cacheable = key === route && Boolean(file);
  if (!file) {
    const captured = await capturePage(key);
    if (captured.redirect) return Response.redirect(new URL(captured.redirect, request.url), 307);
    if (!captured.filename) return new Response(captured.status === 404 ? 'Page not found.' : 'This page could not be loaded. Please try again.', { status: captured.status });
    file = captured.filename;
    directory = captured.directory || directory;
  }
  if (request.headers.get('rsc') === '1') {
    try {
      const flight = await memoize(cacheable && file + ':rsc', async () => localizeFlight(await fs.readFile(path.join(directory, file.replace('.html', '.rsc')), 'utf8')));
      return new Response(flight, { headers: { 'Content-Type': 'text/x-component', 'Cache-Control': 'no-cache', Vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' } });
    } catch { /* Next's client falls back to document navigation if uncaptured. */ }
  }
  const html = await memoize(cacheable && route + ':' + file, async () => {
  let html = await fs.readFile(path.join(directory, file), 'utf8');
  html = localizeDocument(html);
  html = html.replace(/((?:src|href)="\/_next\/static\/[^"?]+\.(?:js|css))"/g, '$1?replica=faq-navigation-v2"');
  // Fresh principal pages use untouched source markup. Older mirrored documents
  // have rewritten relative URLs; a base restores their original directory.
  const base = route === '/' ? '/' : route.slice(0, route.lastIndexOf('/') + 1);
  html = html.replace('<head>', '<head><base href="' + base + '">' + boot);
  html = html.replace(/<script[^>]*src="https:\/\/(?:www\.)?(?:googletagmanager\.com|vercel\.live)[^>]*><\/script>/g, '');
  return html;
  });
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' } });
}

export async function assetResponse(request, host, asset) {
  const hosts = new Set(['kota.co.uk', 'content.kota.co.uk', 'kota-content.b-cdn.net', 'prod.spline.design', 'unpkg.com']);
  if (!hosts.has(host)) return new Response('Unknown asset host', { status: 404 });
  const url = new URL('https://' + host + '/' + asset);
  if (url.hostname !== host) return new Response('Invalid asset path', { status: 400 });
  url.search = new URL(request.url).search;
  const [index, manifest] = await Promise.all([readIndex('assets.json'), readIndex('static-assets.json')]);
  const filename = index[url.href] || index[url.origin + url.pathname]
    || 'reference/assets/' + crypto.createHash('sha256').update(url.href).digest('hex') + (path.extname(url.pathname) || '.bin');
  const destination = manifest.files?.[path.basename(filename)];
  if (destination) return new Response(null, { status: 307, headers: {
    Location: destination, 'Cache-Control': 'public, max-age=3600',
  } });
  // Uncaptured public assets stream from their existing CDN. Never download an
  // entire video into server memory or try to write to Vercel's deployment disk.
  return new Response(null, { status: 307, headers: {
    Location: url.href, 'Cache-Control': 'public, max-age=300',
  } });
}
