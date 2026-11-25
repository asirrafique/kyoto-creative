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
  const contentBuilderRegex = /<section class="ContentBuilder_contentBuilder__jY2p_">[\s\S]*?<\/section>(?=(?:<section class="Share_share__5W87u">|<div class="container">\s*<div class="BlogPost_buttonOuter__M9Wmd">))/;
  const newContentSection = `<section class="ContentBuilder_contentBuilder__jY2p_" suppressHydrationWarning><section class="Text_text__jOaGN" suppressHydrationWarning><span class="FadeInUp_container___uxva" data-fill="false" suppressHydrationWarning><div class="container" suppressHydrationWarning><div class="Text_textInner__lCgQa" suppressHydrationWarning><div class="prose" suppressHydrationWarning>${bodyHtml}</div></div></div></span></section></section>`;
  rendered = rendered.replace(contentBuilderRegex, newContentSection);

  // 8. Ensure Share section, Related Articles, Related Projects, and Author Image are completely removed from HTML DOM
  rendered = rendered.replace(/<figure class="Hero_authorImage__h9wNd">[\s\S]*?<\/figure>/g, '');
  rendered = rendered.replace(/<section class="Share_share__5W87u">[\s\S]*?<\/section>/g, '');
  rendered = rendered.replace(/<section class="RelatedPosts_relatedPosts__xfLkb">[\s\S]*?<\/section>/g, '');
  rendered = rendered.replace(/<section class="RelatedProjects_relatedProjects__opNhl">[\s\S]*?<\/section>/g, '');

  // 9. Sync serialized React Flight data in HTML to prevent hydration mismatch (React error #423)
  const marker = '<script>self.__next_f.push([1,"f:[';
  const startIdx = rendered.indexOf(marker);
  if (startIdx !== -1) {
    const endIdx = rendered.indexOf('</script>', startIdx);
    const fullTag = rendered.slice(startIdx, endIdx + '</script>'.length);
    const jsonStr = fullTag.slice('<script>self.__next_f.push('.length, -')</script>'.length);
    try {
      const arr = JSON.parse(jsonStr);
      const innerStr = arr[1].slice(2, -1);
      const inner = JSON.parse(innerStr);

      const article = inner[2];
      if (article && Array.isArray(article[3]?.children)) {
        // Strip Share, RelatedPosts, and RelatedProjects components from Flight tree
        article[3].children = article[3].children.filter(c => {
          if (Array.isArray(c)) {
            if (c[1] === '$L32') return false;
            if (c[3]?.className?.includes('RelatedPosts') || c[3]?.className?.includes('RelatedProjects') || c[3]?.className?.includes('Share')) {
              return false;
            }
          }
          return true;
        });
      }

      const cb = inner[2]?.[3]?.children?.[1];
      if (cb && cb[3]?.className === 'ContentBuilder_contentBuilder__jY2p_') {
        const child0 = cb[3].children[0];
        const fade = child0[3].children;
        const container = fade[3].children;
        const innerDiv = container[3].children;
        const prose = innerDiv[3].children;
        prose[3].dangerouslySetInnerHTML = { __html: bodyHtml };
        cb[3].children = [child0];
      }

      let newInnerStr = JSON.stringify(inner);
      newInnerStr = newInnerStr.replaceAll('10 creative websites to inspire your next design (2025 update) - KOTA', `${title} - Kyoto Creative`);
      newInnerStr = newInnerStr.replaceAll('10 creative websites to inspire your next design (2025 update)', title);
      newInnerStr = newInnerStr.replaceAll('10 creative websites to inspire your next design', title);
      newInnerStr = newInnerStr.replaceAll('10-creative-websites-to-inspire-your-next-web-design-2025-update', slug);
      newInnerStr = newInnerStr.replaceAll('"Inspiration"', `"${category}"`);
      newInnerStr = newInnerStr.replaceAll('["By ","Emily"]', `["By ","${author}"]`);

      if (post.featuredImage?.asset?.url) {
        const imgUrl = post.featuredImage.asset.url;
        const width = post.featuredImage.asset.metadata?.dimensions?.width || 1400;
        const height = post.featuredImage.asset.metadata?.dimensions?.height || 788;
        const alt = post.featuredImage.alt || title;
        newInnerStr = newInnerStr.replace(
          /"image":\{"altText":"","srcSet":"[^"]+","sourceUrl":"[^"]+","mediaDetails":\{"width":\d+,"height":\d+\}\}/,
          `"image":{"altText":${JSON.stringify(alt)},"srcSet":${JSON.stringify(`${imgUrl} ${width}w`)},"sourceUrl":${JSON.stringify(imgUrl)},"mediaDetails":{"width":${width},"height":${height}}}`
        );
      }

      const newArr = [1, 'f:' + newInnerStr + '\n'];
      const newScript = '<script>self.__next_f.push(' + JSON.stringify(newArr) + ')</script>';
      rendered = rendered.replace(fullTag, newScript);
    } catch {
      // Fallback silently if flight tree cannot be parsed
    }
  }

  return rendered;
}

export function renderSanityBlogPostRsc(templateRsc, post) {
  let rsc = templateRsc;
  const title = post.title || 'Untitled Post';
  const category = post.category || 'Expertise';
  const author = post.author || 'Kyoto Creative';
  const slug = post.slug || '';
  const bodyHtml = blocksToHtml(post.body) || (post.excerpt ? `<p>${post.excerpt}</p>` : '');

  // 1. Replace template title & slug
  rsc = rsc.replaceAll('10 creative websites to inspire your next design (2025 update) - KOTA', `${title} - Kyoto Creative`);
  rsc = rsc.replaceAll('10 creative websites to inspire your next design (2025 update)', title);
  rsc = rsc.replaceAll('10 creative websites to inspire your next design', title);
  rsc = rsc.replaceAll('10-creative-websites-to-inspire-your-next-web-design-2025-update', slug);

  // 2. Category
  rsc = rsc.replaceAll('"Inspiration"', `"${category}"`);
  rsc = rsc.replaceAll('children":"Inspiration"', `children":"${category}"`);

  // 3. Author
  rsc = rsc.replaceAll('["By ","Emily"]', `["By ","${author}"]`);
  rsc = rsc.replaceAll('"By Emily"', `"By ${author}"`);

  // 4. Featured Image in Hero
  if (post.featuredImage?.asset?.url) {
    const imgUrl = post.featuredImage.asset.url;
    const width = post.featuredImage.asset.metadata?.dimensions?.width || 1400;
    const height = post.featuredImage.asset.metadata?.dimensions?.height || 788;
    const alt = post.featuredImage.alt || title;
    
    rsc = rsc.replace(
      /"image":\{"altText":"","srcSet":"[^"]+","sourceUrl":"[^"]+","mediaDetails":\{"width":\d+,"height":\d+\}\}/,
      `"image":{"altText":${JSON.stringify(alt)},"srcSet":${JSON.stringify(`${imgUrl} ${width}w`)},"sourceUrl":${JSON.stringify(imgUrl)},"mediaDetails":{"width":${width},"height":${height}}}`
    );
  }

  // 5. Update ContentBuilder and strip Share & Related sections in line 54
  const lines = rsc.split('\n');
  if (lines.length > 54 && lines[54].startsWith('2:[')) {
    try {
      const payload = JSON.parse(lines[54].slice(2));
      const article = payload[2];
      if (article && Array.isArray(article[3]?.children)) {
        article[3].children = article[3].children.filter(c => {
          if (Array.isArray(c)) {
            if (c[1] === '$L23') return false;
            if (c[3]?.className?.includes('RelatedPosts') || c[3]?.className?.includes('RelatedProjects') || c[3]?.className?.includes('Share')) {
              return false;
            }
          }
          return true;
        });
      }
      const cb = article[3]?.children?.[1];
      if (cb && cb[3]?.className === 'ContentBuilder_contentBuilder__jY2p_') {
        const child0 = cb[3].children[0];
        const fade = child0[3].children;
        const container = fade[3].children;
        const innerDiv = container[3].children;
        const prose = innerDiv[3].children;
        prose[3].dangerouslySetInnerHTML = { __html: bodyHtml };
        cb[3].children = [child0];
      }
      lines[54] = '2:' + JSON.stringify(payload);
      rsc = lines.join('\n');
    } catch {
      // Fallback silently if parsing fails
    }
  }

  return rsc;
}
