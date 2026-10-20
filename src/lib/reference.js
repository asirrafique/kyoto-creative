import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import path from 'node:path';
import crypto from 'node:crypto';
import { installHeroVideoControls } from './hero-video';
import { installFaqControls } from './faq-controls';
import { installLinkControls } from './link-controls';
import { capturePage, pageKey, readIndex } from './page-cache';

const root = process.cwd();
const hosts = new Set(['kota.co.uk', 'content.kota.co.uk', 'kota-content.b-cdn.net', 'prod.spline.design', 'unpkg.com']);
const mime = { '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.wasm': 'application/wasm', '.ico': 'image/x-icon' };

export function localize(text) {
  // Apply the same substitutions to server HTML, Flight data, and client modules.
  // Matching all three is essential to avoid React hydration mismatches.
  for (const host of hosts) {
    if (host !== 'kota.co.uk') text = text.replaceAll('https://' + host, '/__assets/' + host);
  }
  text = text.replaceAll('https://www.googletagmanager.com', '/__analytics');
  text = text.replaceAll('https://static.hotjar.com', '/__analytics');
  text = text.replaceAll('https://kota.co.uk/', '/');
  text = text.replaceAll('Someone from the KOTA team will be contacting you shortly. In the meantime, how about checking out some of our latest projects :', 'Your enquiry has been saved locally. Email delivery is not connected in this replica. In the meantime, explore some of our latest projects :');
  text = text.replaceAll('Keep an eye out for your first KOTA newsletter.', 'Your subscription has been saved locally. Newsletter delivery is not connected.');
  text = text.replaceAll("Follow the link below. We've also emailed it for future reference..", 'Follow the link below to view your results. Your responses have been saved locally.');
  return text;
}

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

async function json(name) {
  return JSON.parse(await fs.readFile(path.join(root, 'reference', name), 'utf8'));
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
  if (!file) {
    const captured = await capturePage(key);
    if (captured.redirect) return Response.redirect(new URL(captured.redirect, request.url), 307);
    if (!captured.filename) return new Response(captured.status === 404 ? 'Page not found.' : 'This page could not be loaded. Please try again.', { status: captured.status });
    file = captured.filename;
  }
  if (request.headers.get('rsc') === '1') {
    try {
      const flight = localizeFlight(await fs.readFile(path.join(root, 'reference/pages', file.replace('.html', '.rsc')), 'utf8'));
      return new Response(flight, { headers: { 'Content-Type': 'text/x-component', 'Cache-Control': 'no-cache', Vary: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' } });
    } catch { /* Next's client falls back to document navigation if uncaptured. */ }
  }
  let html = await fs.readFile(path.join(root, 'reference/pages', file), 'utf8');
  html = localizeDocument(html);
  html = html.replace(/((?:src|href)="\/_next\/static\/[^"?]+\.(?:js|css))"/g, '$1?replica=faq-navigation-v2"');
  // Fresh principal pages use untouched source markup. Older mirrored documents
  // have rewritten relative URLs; a base restores their original directory.
  const base = route === '/' ? '/' : route.slice(0, route.lastIndexOf('/') + 1);
  html = html.replace('<head>', '<head><base href="' + base + '">' + boot);
  html = html.replace(/<script[^>]*src="https:\/\/(?:www\.)?(?:googletagmanager\.com|vercel\.live)[^>]*><\/script>/g, '');
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' } });
}

export async function assetResponse(request, host, asset) {
  if (!hosts.has(host)) return new Response('Unknown asset host', { status: 404 });
  const url = new URL('https://' + host + '/' + asset);
  const incoming = new URL(request.url);
  url.search = incoming.search;
  const index = await json('assets.json');
  let filename = index[url.href] || index[url.origin + url.pathname];
  const extension = path.extname(url.pathname);
  if (!filename) {
    // An allowlisted, cached fallback supports deep pages not visited during capture.
    // No arbitrary host proxy and no forwarding of visitor cookies or credentials.
    const cached = path.join('reference/assets', crypto.createHash('sha256').update(url.href).digest('hex') + (extension || '.bin'));
    try { await fs.access(path.join(root, cached)); filename = cached; } catch {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) return new Response('Reference asset unavailable', { status: response.status });
        const body = Buffer.from(await response.arrayBuffer());
        await fs.mkdir(path.join(root, 'reference/assets'), { recursive: true });
        await fs.writeFile(path.join(root, cached), body);
        filename = cached;
      } catch { return new Response('Reference asset is not cached', { status: 503 }); }
    }
  }
  const assetRoot = path.join(root, 'reference/assets');
  const resolved = path.resolve(assetRoot, path.basename(filename));
  if (!filename.replaceAll('\\', '/').startsWith('reference/assets/')) return new Response('Invalid asset path', { status: 400 });
  const transformed = ['.js', '.css', '.svg'].includes(extension);
  const body = transformed ? Buffer.from(localize(await fs.readFile(resolved, 'utf8'))) : null;
  const length = body ? body.length : (await fs.stat(resolved)).size;
  const headers = { 'Content-Type': mime[extension] || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable', 'Accept-Ranges': 'bytes' };
  if (transformed) headers['Cache-Control'] = 'no-cache';
  if (extension === '.zip') {
    headers['Content-Type'] = 'application/zip';
    headers['Content-Disposition'] = 'attachment; filename="' + path.basename(url.pathname) + '"';
  }
  if (extension === '.pdf') headers['Content-Type'] = 'application/pdf';
  const range = request.headers.get('range');
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m) {
      const start = m[1] ? Number(m[1]) : Math.max(0, length - Number(m[2]));
      const end = m[1] && m[2] ? Math.min(Number(m[2]), length - 1) : length - 1;
      if (start > end || start >= length) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + length } });
      headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + length;
      headers['Content-Length'] = String(end - start + 1);
      return new Response(body ? body.subarray(start, end + 1) : Readable.toWeb(createReadStream(resolved, { start, end })), { status: 206, headers });
    }
  }
  headers['Content-Length'] = String(length);
  return new Response(body || Readable.toWeb(createReadStream(resolved)), { headers });
}
