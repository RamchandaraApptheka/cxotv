import { BACKEND_URL, FRONTEND_URL } from './env';
import { resolveImageUrl } from './resolveImageUrl';
export async function generateNewsMetadata(params, region = '') {
  // Default metadata
  const regionText = region ? `${region} ` : '';
  const defaultMetadata = {
    title: `CXOTV Today${region ? ` ${region}` : ''} Article`,
    description: `Latest${regionText}news and insights from CXOTV Today`,
    openGraph: {
      title: `CXOTV Today${region ? ` ${region}` : ''} Article`,
      description: `Latest${regionText}news and insights from CXOTV Today`,
      type: 'website',
      url: `${FRONTEND_URL}/${region.toLowerCase()}/${params.title}`,
      images: []
    },
    twitter: {
      card: 'summary_large_image',
      title: `CXOTV Today${region ? ` ${region}` : ''} Article`,
      description: `Latest${regionText}news and insights from CXOTV Today`,
      images: []
    },
    alternates: {
      canonical: `${FRONTEND_URL}/${region.toLowerCase()}/${params.title}`
    }
  };

  // If no params or title, return default metadata immediately
  if (!params?.title) {
    return defaultMetadata;
  }

  try {
    // Add timeout to prevent hanging on slow connections
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let data;
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/news?populate=*&filters[slug][$eq]=${encodeURIComponent(params.title)}`,
        { 
          next: { revalidate: 3600 },
          signal: controller.signal 
        }
      );
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`Failed to fetch news data: ${res.status} ${res.statusText}`);
        return defaultMetadata;
      }

      data = await res.json();
    } catch (fetchError) {
      console.warn('Error fetching news data:', fetchError.message);
      return defaultMetadata;
    }

    // Safely access the item data
    const item = data?.data?.[0]?.attributes;
    if (!item) {
      console.warn(`News item not found for slug: ${params.title}`);
      return defaultMetadata;
    }

    // Process image URL
    const imageUrl = item.image?.data?.attributes?.url
      ? resolveImageUrl(item.image.data.attributes.url)
      : null;

    // Process keywords
    const keywords = item.keywords
      ? item.keywords.replace(/\n+/g, '').trim()
      : '';

    // Construct canonical URL
    const canonicalUrl = `${FRONTEND_URL}/${region.toLowerCase()}/${params.title}`;

    return {
      title: item.title || defaultMetadata.title,
      description: item.description || defaultMetadata.description,
      keywords: keywords,
      openGraph: {
        ...defaultMetadata.openGraph,
        title: item.title || defaultMetadata.openGraph.title,
        description: item.description || defaultMetadata.openGraph.description,
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
      twitter: {
        ...defaultMetadata.twitter,
        title: item.title || defaultMetadata.twitter.title,
        description: item.description || defaultMetadata.twitter.description,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Unexpected error in metadata generation:', error);
    return defaultMetadata;
  }
}
