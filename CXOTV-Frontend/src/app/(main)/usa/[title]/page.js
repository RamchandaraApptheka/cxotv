export const revalidate = 60; // — ISR

// app/[category]/[title]/page.js
import { notFound, redirect } from 'next/navigation';
import SingleNews from '../../components/SingleNews';
import { getCategoryFromNews } from '@/utils/getCategoryFromNews';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

export default async function MainLayoutPage({ params }) {
  // Validate the news item exists and belongs to USA region
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
        const region = newsItem.attributes?.region?.data?.attributes?.name?.toLowerCase();

        // If post doesn't belong to USA region, redirect to correct region or category
        if (region && region !== 'usa') {
          const correctCategory = getCategoryFromNews(newsItem);
          if (correctCategory) {
            // Redirect to category URL (canonical format)
            redirect(`/${correctCategory}/${params.title}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Region validation error:', error);
    // Continue rendering even if validation fails
  }

  return <SingleNews />;
}

export async function generateMetadata({ params }) {
  // Guard: ignore file-like slugs to prevent metadata errors from requests like /favicon.ico
  if (params?.title && /\.(ico|png|jpg|jpeg|svg|webp|gif|json|txt)$/i.test(params.title)) {
    return {
      title: 'CXOTV Today',
      description: 'The Voice of CXOs worldwide',
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
        description: 'The Voice of CXOs worldwide',
      };
    }

    const data = await res.json();
    const newsItem = data.data?.[0];
    const item = newsItem?.attributes;

    if (!item) {
      return {
        title: 'CXOTV Today',
        description: 'The Voice of CXOs worldwide',
      };
    }

    // Get the correct category from the news item for canonical URL
    const correctCategory = getCategoryFromNews(newsItem);
    const canonicalUrl = correctCategory
      ? `${FRONTEND_URL}/${correctCategory}/${params.title}`
      : `${FRONTEND_URL}/usa/${params.title}`;

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
      description: 'The Voice of CXOs worldwide',
      keywords: keywords || 'recent tech news, tech articles, tech magazines, tech news today, technology articles, ai news',

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: `${item.title || 'Article'} - CXO TV | Techplus Media`,
        description: 'The Voice of CXOs worldwide',
        type: 'article',
        url: canonicalUrl, // Use correct category URL, not undefined params.category
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
        description: 'The Voice of CXOs worldwide',
        images: imageUrl ? [imageUrl] : [],
        creator: '@cxotv', // Add your Twitter handle if available
      },

      // Canonical URL - Use category-based URL as canonical
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
    // Swallow unexpected errors to reduce log noise in production
    return {
      title: 'CXOTV Today',
      description: 'The Voice of CXOs worldwide',
    };
  }
}
