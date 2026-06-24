export const revalidate = 60; // — ISR

// app/[category]/[title]/page.js

import SingleNews from "@/app/(main)/components/SingleNews";
import { getCanonicalUrl } from '@/utils/canonicalUrl';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';


export default function MainLayoutPage({ params }) {
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
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      return {
        title: 'CXOTV Today',
        description: 'The Voice of CXOs worldwide',
      };
    }

    const data = await res.json();
    const item = data.data[0]?.attributes;

    if (!item) {
      return {
        title: 'CXOTV Today',
        description: 'The Voice of CXOs worldwide',
      };
    }

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
      description: 'The Voice of CXOs worldwide',
      keywords: keywords,

      // Open Graph (Facebook, LinkedIn)
      openGraph: {
        title: item.title || 'CXOTV Today Article',
        description: 'The Voice of CXOs worldwide',
        type: 'article',
        url: `${FRONTEND_URL}/${params.category}/${params.title}`,
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

      // Canonical URL
      alternates: {
        canonical: getCanonicalUrl(`/health-technology/${params.title}`, params.title),
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
