export const revalidate = 60; // — ISR

// app/[category]/[title]/page.js
import { notFound, redirect } from 'next/navigation';
import SingleNews from '../../components/SingleNews';
import { getCategoryFromNews } from '@/utils/getCategoryFromNews';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

export default async function MainLayoutPage({ params }) {
  // Validate the news item exists and belongs to India region
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

        // If post doesn't belong to India region, redirect to correct region or category
        if (region && region !== 'india') {
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
  // Guard: ignore file-like slugs such as favicon.ico to prevent noisy logs and fetches
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
      // Avoid throwing for expected non-news cases; fall back to default metadata
      return {
        title: 'CXOTV Today',
        description: 'The Voice of CXOs worldwide',
      };
    }

    const data = await res.json();
    const newsItem = data.data?.[0];
    const item = newsItem?.attributes;

    if (!item) {
      // No item found for slug; return safe defaults without logging an error
      return {
        title: 'CXOTV Today',
        description: 'The Voice of CXOs worldwide',
      };
    }

    // Get the correct category from the news item for canonical URL
    const correctCategory = getCategoryFromNews(newsItem);
    const canonicalUrl = correctCategory
      ? `${FRONTEND_URL}/${correctCategory}/${params.title}`
      : `${FRONTEND_URL}/india/${params.title}`;

    // Process image URL
    const imageUrl = item.image?.data?.attributes?.url
      ? resolveImageUrl(item.image.data.attributes.url)
      : null;

    // Process keywords (remove extra newlines and trim)
    const keywords = item.keywords
      ? item.keywords.replace(/\n+/g, '').trim()
      : '';

    return {
      title: item.title || 'CXOTV Today Article',
      description: item.description || 'Latest news and insights from CXOTV Today',
      keywords: keywords,

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: item.title || 'CXOTV Today Article',
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
        title: item.title || 'CXOTV Today Article',
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
    // Swallow unexpected errors to prevent log noise in production
    return {
      title: 'CXOTV Today',
      description: 'The Voice of CXOs worldwide',
    };
  }
}
