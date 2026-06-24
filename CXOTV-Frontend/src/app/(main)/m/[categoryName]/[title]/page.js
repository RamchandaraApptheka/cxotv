export const revalidate = 60; // — ISR
export const dynamicParams = true; // Render new slugs on-demand, then cache via ISR

// app/[category]/[title]/page.js
import { redirect } from 'next/navigation';
import SingleNews from '../../../components/SingleNews';
import { getCategoryFromNews } from '@/utils/getCategoryFromNews';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

/**
 * — Pre-build top 100 most recent articles at deploy time.
 * New articles not in this list are rendered on first request (dynamicParams=true)
 * and then cached by ISR for subsequent visitors.
 */
export async function generateStaticParams() {
  try {
    const apiBase = process.env.STRAPI_API_URL || BACKEND_URL;
    const res = await fetch(
      `${apiBase}/api/news?populate=categories,subcategories&pagination[pageSize]=100&sort=publishedAt:DESC`,
      { cache: 'no-store' } // always fresh at build time
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data || []).flatMap((item) => {
      const slug = item?.attributes?.slug;
      if (!slug) return [];
      const category = getCategoryFromNews(item) || 'technology';
      return [{ categoryName: category, title: slug }];
    });
  } catch {
    return []; // build continues without pre-built params
  }
}

export default async function MainLayoutPage({ params }) {
  // Validate category matches the news item's actual category
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/news?populate=*&filters[slug][$eq]=${params.title}`,
      {
        next: { revalidate: 3600 }
      }
    );

    if (res.ok) {
      const data = await res.json();
      const newsItem = data.data[0];

      if (newsItem) {
        const correctCategory = getCategoryFromNews(newsItem);
        const currentCategory = params.categoryName; // Category from URL

        // If category doesn't match, redirect to correct URL
        if (correctCategory && correctCategory !== currentCategory) {
          redirect(`/${correctCategory}/${params.title}`);
        }
      }
    }
  } catch (error) {

    // Continue rendering even if validation fails
  }

  return <SingleNews />;
}

export async function generateMetadata({ params }) {
  // Guard: ignore file-like slugs such as favicon.ico to prevent noisy logs and fetches
  if (params?.title && /\.(ico|png|jpg|jpeg|svg|webp|gif|json|txt)$/i.test(params.title)) {
    return {
      title: 'CXO TV | Techplus Media',
      description: 'The Voice of CXOs Worldwide',
    };
  }
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/news?populate=*&filters[slug][$eq]=${params.title}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': process.env.NEXT_PUBLIC_SITE_URL || FRONTEND_URL
        }
      }
    );

    if (!res.ok) {
      console.error('generateMetadata: Failed to fetch news data:', res.status, res.statusText);
      return {
        title: 'CXO TV | Techplus Media',
        description: 'The Voice of CXOs Worldwide',
        alternates: { canonical: FRONTEND_URL },
      };
    }

    const data = await res.json();
    const newsItem = data.data?.[0];
    const item = newsItem?.attributes;

    if (!item) {
      console.error('News item not found for slug:', params.title);
      return {
        title: 'CXO TV | Techplus Media',
        description: 'The Voice of CXOs Worldwide',
      };
    }

    // Get the correct category from the news item (not from URL params)
    const correctCategory = getCategoryFromNews(newsItem) || params.categoryName;
    const canonicalUrl = `${FRONTEND_URL}/${correctCategory}/${params.title}`;

    // Process image URL
    const imageUrl = item.image?.data?.attributes?.url
      ? resolveImageUrl(item.image.data.attributes.url)
      : null;

    // Process keywords (remove extra newlines and trim)
    const keywords = item.keywords
      ? item.keywords.replace(/\n+/g, '').trim()
      : '';

    return {
      title: `${item.title || 'Article'} - CXO TV | Techplus Media`,
      description: item.description || 'Stay updated with the latest technology news, AI innovations, and science articles from CXO TV.',
      keywords: keywords || 'recent tech news, tech articles, tech magazines, tech news today, technology articles, ai news',

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: `${item.title || 'Article'} - CXO TV | Techplus Media`,
        description: item.description || 'Stay updated with the latest technology news, AI innovations, and science articles from CXO TV.',
        type: 'article',
        url: canonicalUrl, // Use correct category, not URL param
        images: imageUrl
          ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: item.title || 'Article image',
            }
          ]
          : [],
        publishedTime: item.publishedAt,
        authors: [item.authName || 'CXOTV Team'],
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: `${item.title || 'Article'} - CXO TV | Techplus Media`,
        description: item.description || 'Stay updated with the latest technology news, AI innovations, and science articles from CXO TV.',
        images: imageUrl ? [imageUrl] : [],
        creator: '@cxotv',
      },

      // Canonical URL - Use correct category from actual post data
      alternates: {
        canonical: canonicalUrl,
      },

      // Additional SEO metadata
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    };
  } catch (error) {
    // Swallow unexpected errors to prevent log noise in production
    return {
      title: 'CXOTV Today',
      description: 'The Voice of CXOs worldwide',
    };
  }
}
