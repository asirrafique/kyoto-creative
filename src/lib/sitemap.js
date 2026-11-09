const CANONICAL_PAGES = [
  { url: 'https://www.kyotocreative.com/', changefreq: 'weekly', priority: '1.0' },
  { url: 'https://www.kyotocreative.com/work', changefreq: 'weekly', priority: '0.9' },
  { url: 'https://www.kyotocreative.com/contact', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/marketing', changefreq: 'weekly', priority: '0.9' },
  { url: 'https://www.kyotocreative.com/brand-strategy-positioning', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/content-campaigns-pr', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/paid-media-performance', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/brand-identity-creative', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/web-app', changefreq: 'weekly', priority: '0.9' },
  { url: 'https://www.kyotocreative.com/website-design-development', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/product-design-ux', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/app-design-development', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/ai-automations', changefreq: 'weekly', priority: '0.9' },
  { url: 'https://www.kyotocreative.com/intelligent-document-data-processing', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/autonomous-ai-agents-copilots', changefreq: 'monthly', priority: '0.8' },
  { url: 'https://www.kyotocreative.com/workflow-orchestration-api-integration', changefreq: 'monthly', priority: '0.8' },
];

export function generateSitemapXml() {
  const urlsXml = CANONICAL_PAGES.map(page => `  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
}

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: https://www.kyotocreative.com/sitemap.xml
`;
}
