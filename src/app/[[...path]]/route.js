import { assetResponse, documentResponse } from '../../lib/reference';
import { formActionResponse } from '../../lib/form-actions';
import { generateSitemapXml, generateRobotsTxt } from '../../lib/sitemap';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  return formActionResponse(request);
}

export async function GET(request, context) {
  const { path = [] } = await context.params;
  const fullPath = path.join('/');

  if (fullPath === 'sitemap.xml') {
    return new Response(generateSitemapXml(), {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  }

  if (fullPath === 'robots.txt') {
    return new Response(generateRobotsTxt(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  }

  if (path[0] === '__static' && path[2] === '__assets') return assetResponse(request, path[3], path.slice(4).join('/'));
  if (path[0] === '__analytics') return new Response('/* Analytics disabled in the local replica. */', { headers: { 'Content-Type': 'application/javascript' } });
  if (path[0] === '__assets') return assetResponse(request, path[1], path.slice(2).join('/'));
  if (path[0] === '__runtime' && path[1] === 'faq-navigation-v1' && path[2] === '_next') return assetResponse(request, 'kota.co.uk', path.slice(2).join('/'));
  if (path[0] === 'images' || path[0] === 'src' || /\.(?:png|jpe?g|gif|svg|webp|avif|ico|mp4|webm|woff2?|glb|gltf|splinecode|wasm|json|js|css|zip|pdf)$/i.test(path.at(-1) || '')) return assetResponse(request, 'kota.co.uk', path.join('/'));
  return documentResponse(request, '/' + path.join('/'));
}
