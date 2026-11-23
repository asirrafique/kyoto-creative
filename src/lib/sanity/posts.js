import { sanityClient } from './client.js';

export async function fetchPublishedBlogPosts() {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      return [];
    }

    const query = `*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      featured,
      publishedAt,
      author,
      category,
      featuredImage {
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt
      }
    }`;

    const posts = await sanityClient.fetch(query);
    if (!Array.isArray(posts) || posts.length === 0) {
      return [];
    }

    const defaultImage = 'https://kota-content.b-cdn.net/app/uploads/2025/01/creative-web-design-inspo-2025.png';
    const defaultSrcSet = 'https://kota-content.b-cdn.net/app/uploads/2025/01/creative-web-design-inspo-2025.png 1400w, https://kota-content.b-cdn.net/app/uploads/2025/01/creative-web-design-inspo-2025-500x281.png 500w, https://kota-content.b-cdn.net/app/uploads/2025/01/creative-web-design-inspo-2025-768x432.png 768w';

    return posts.map(post => {
      const imgUrl = post.featuredImage?.asset?.url || defaultImage;
      const width = post.featuredImage?.asset?.metadata?.dimensions?.width || 1400;
      const height = post.featuredImage?.asset?.metadata?.dimensions?.height || 788;
      const srcSet = post.featuredImage?.asset?.url
        ? `${imgUrl} ${width}w`
        : defaultSrcSet;

      const categoryName = post.category || 'Expertise';
      const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      return {
        node: {
          title: post.title,
          databaseId: post._id,
          slug: post.slug,
          categories: {
            edges: [
              {
                node: {
                  slug: categorySlug,
                  name: categoryName,
                },
              },
            ],
          },
          singlePost: {
            postDetails: {
              featuredImage: {
                altText: post.featuredImage?.alt || post.title || '',
                srcSet,
                sourceUrl: imgUrl,
                mediaDetails: {
                  width,
                  height,
                },
              },
            },
          },
        },
      };
    });
  } catch (error) {
    console.error('Failed to fetch published blog posts from Sanity:', error?.message || error);
    return [];
  }
}

export async function fetchPublishedBlogPostBySlug(slug) {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !slug) {
      return null;
    }

    const query = `*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      featured,
      publishedAt,
      author,
      readTime,
      category,
      featuredImage {
        asset-> {
          _id,
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt
      },
      body,
      seo
    }`;

    const post = await sanityClient.fetch(query, { slug });
    return post || null;
  } catch (error) {
    console.error('Failed to fetch published blog post from Sanity by slug:', error?.message || error);
    return null;
  }
}

export function blocksToHtml(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';

  return blocks.map(block => {
    if (block._type !== 'block') {
      return '';
    }

    const style = block.style || 'normal';
    const childrenHtml = (block.children || []).map(child => {
      let text = child.text || '';
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (Array.isArray(child.marks)) {
        if (child.marks.includes('strong')) text = `<strong>${text}</strong>`;
        if (child.marks.includes('em')) text = `<em>${text}</em>`;
        if (child.marks.includes('code')) text = `<code>${text}</code>`;
        if (child.marks.includes('underline')) text = `<u>${text}</u>`;
      }
      return text;
    }).join('');

    switch (style) {
      case 'h1':
        return `<h1>${childrenHtml}</h1>`;
      case 'h2':
        return `<h2>${childrenHtml}</h2>`;
      case 'h3':
        return `<h3>${childrenHtml}</h3>`;
      case 'h4':
        return `<h4>${childrenHtml}</h4>`;
      case 'blockquote':
        return `<blockquote><p>${childrenHtml}</p></blockquote>`;
      default:
        return `<p>${childrenHtml}</p>`;
    }
  }).filter(Boolean).join('\n');
}

export function formatPostDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    return `${month} ${day}${suffix} ${year}`;
  } catch {
    return dateStr;
  }
}

export function renderSanityBlogPostHtml(templateHtml, post) {
  let rendered = templateHtml;

  const title = post.title || 'Untitled Post';
  const category = post.category || 'Expertise';
  const author = post.author || 'Kyoto Creative';
  const dateStr = formatPostDate(post.publishedAt) || 'November 2026';
  const slug = post.slug || '';
  const bodyHtml = blocksToHtml(post.body) || (post.excerpt ? `<p>${post.excerpt}</p>` : '');

  // 1. Replace template title & slug references
  rendered = rendered.replaceAll('10 creative websites to inspire your next design (2025 update)', title);
  rendered = rendered.replaceAll('10 creative websites to inspire your next design', title);
  rendered = rendered.replaceAll('10-creative-websites-to-inspire-your-next-web-design-2025-update', slug);

  // 2. Head title & meta
  rendered = rendered.replace(
    /<title>[^<]+<\/title>/,
    `<title>${title} | Kyoto Creative</title>`
  );

  // 3. Category in Hero
  rendered = rendered.replaceAll('Inspiration', category);

  // 4. Author in Hero
  rendered = rendered.replaceAll('By <!-- -->Emily', `By <!-- -->${author}`);
  rendered = rendered.replaceAll('By Emily', `By ${author}`);

  // 5. Date in Hero
  rendered = rendered.replaceAll('January 28th 2025', dateStr);

  // 6. Featured Image in Hero
  if (post.featuredImage?.asset?.url) {
    const imgUrl = post.featuredImage.asset.url;
    const width = post.featuredImage.asset.metadata?.dimensions?.width || 1400;
    const height = post.featuredImage.asset.metadata?.dimensions?.height || 788;
    const alt = post.featuredImage.alt || title;
    const newHeroImg = `<figure class="Hero_image__1mu0E"><div class="ImageEnter_image__FSEP_" data-fill="true"><span class="Image_image__RAAdZ Image_fill__EiIzS"><img srcSet="${imgUrl} ${width}w" src="${imgUrl}" alt="${alt}" loading="eager" fetchPriority="low" height="${height}" width="${width}" sizes="100vw"/></span></div></figure>`;
    rendered = rendered.replace(/<figure class="Hero_image__1mu0E">[\s\S]*?<\/figure>/, newHeroImg);
  }

  // 7. ContentBuilder: Replace with rich-text content section
  const contentBuilderRegex = /<section class="ContentBuilder_contentBuilder__jY2p_">[\s\S]*?<\/section>(?=<section class="Share_share__5W87u">)/;
  const newContentSection = `<section class="ContentBuilder_contentBuilder__jY2p_"><section class="Text_text__jOaGN"><span class="FadeInUp_container___uxva" data-fill="false"><div class="container"><div class="Text_textInner__lCgQa"><div class="prose">${bodyHtml}</div></div></div></span></section></section>`;
  rendered = rendered.replace(contentBuilderRegex, newContentSection);

  return rendered;
}
