export const revalidate = 60; // — ISR

// app/[category]/[title]/page.js
import { redirect } from 'next/navigation';
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
        const currentCategory = 'fintech'; // This route is for fintech category

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
  // Guard: ignore file-like slugs (e.g., favicon.ico) to prevent noisy errors
  if (params?.title && /\.(ico|png|jpg|jpeg|svg|webp|gif|json|txt)$/i.test(params.title)) {
    return {
      title: 'CXOTV Today',
      description: 'The Voice of CXOs worldwide',
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
      console.error('Failed to fetch news data:', res.status, res.statusText);
      return {
        title: 'CXOTV Today',
        description: 'The Voice of CXOs worldwide',
      };
    }

    const data = await res.json();
    const newsItem = data.data?.[0];
    const item = newsItem?.attributes;

    if (!item) {
      console.error('News item not found for slug:', params.title);
      return {
        title: 'CXOTV Today',
        description: 'The Voice of CXOs worldwide',
      };
    }

    // Get the correct category from the news item
    const correctCategory = getCategoryFromNews(newsItem) || 'fintech';
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
      description: item.description || 'The Voice of CXOs worldwide',
      keywords: keywords,

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: item.title || 'CXOTV Today Article',
        description: item.description || 'The Voice of CXOs worldwide',
        type: 'article',
        url: canonicalUrl,
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
        creator: '@cxotv',
      },

      // Canonical URL - Use dynamically determined correct category
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
      description: 'The Voice of CXOs worldwide',
    };
  }
}
