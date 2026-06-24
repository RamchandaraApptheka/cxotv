export const revalidate = 60; // — ISR

// app/[category]/[title]/page.js
import { notFound, redirect } from 'next/navigation';
import SingleNews from '../../../components/SingleNews';
import { getCategoryFromNews } from '@/utils/getCategoryFromNews';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

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
  // Guard: ignore file-like slugs (e.g., favicon.ico)
  if (params?.title && /\.(ico|png|jpg|jpeg|svg|webp|gif|json|txt)$/i.test(params.title)) {
    return {
      title: 'CXOTV Today',
      description: 'Latest news and insights from CXOTV Today',
    };
  }
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/news?populate=*&filters[slug][$eq]=${params.title}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      return {
        title: 'CXOTV Today',
        description: 'Latest news and insights from CXOTV Today',
      };
    }

    const data = await res.json();
    const newsItem = data.data?.[0];
    const item = newsItem?.attributes;

    if (!item) {
      return {
        title: 'CXOTV Today',
        description: 'Latest news and insights from CXOTV Today',
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
        creator: '@cxotv', // Add your Twitter handle if available
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
    // Swallow unexpected errors to reduce log noise
    return {
      title: 'CXOTV Today',
      description: 'Latest news and insights from CXOTV Today',
    };
  }
}
