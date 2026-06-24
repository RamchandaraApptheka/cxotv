export const revalidate = 60; // — ISR

// app/[category]/[title]/page.js

import { notFound, redirect } from 'next/navigation';
import ContentWrapper from "@/app/(main)/components/ContentWrapper";
import SingleNews from "@/app/(main)/components/SingleNews";
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

  return <ContentWrapper>
    <SingleNews />
  </ContentWrapper>
}

export async function generateMetadata({ params }) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/news?populate=*&filters[slug][$eq]=${params.title}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      throw new Error('Failed to fetch news data');
    }

    const data = await res.json();
    const newsItem = data.data?.[0];
    const item = newsItem?.attributes;

    if (!item) {
      throw new Error('News item not found');
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
      title: item.title || 'CXOTV Today Article',
      description: item.description || 'Latest news and insights from CXOTV Today',
      keywords: keywords,

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: item.title || 'CXOTV Today Article',
        description: item.description || 'Latest news and insights from CXOTV Today',
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
        title: item.title || 'CXOTV Today Article',
        description: item.description || 'Latest news and insights from CXOTV Today',
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
    console.error('Metadata generation error:', error);
    return {
      title: 'CXOTV Today',
      description: 'Latest news and insights from CXOTV Today',
    };
  }
}
