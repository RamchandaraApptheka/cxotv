/**
 * SEO Utilities - Generate proper metadata for category/article pages
 *
 * Handles canonical URLs, Open Graph tags, Twitter cards, etc.
 */

import { slugToCategoryName } from './categoryUtils';
import { resolveImageUrl } from './resolveImageUrl';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cxotv.com';
const SITE_NAME = 'CXO TV';

/**
 * Generate SEO metadata for category page
 *
 * @param {string} categorySlug - Category slug (lowercase)
 * @returns {Object} - Next.js metadata object
 */
export function generateCategoryMetadata(categorySlug) {
  const categoryName = slugToCategoryName(categorySlug);
  const canonicalUrl = `${SITE_URL}/${categorySlug}`;

  return {
    title: `${categoryName} News & Updates | ${SITE_NAME}`,
    description: `Latest ${categoryName} news, insights, technology trends, and updates for business leaders and CXOs. Stay informed with expert analysis and industry developments.`,

    // Canonical URL (important for SEO!)
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      title: `${categoryName} News | ${SITE_NAME}`,
      description: `Stay updated with latest ${categoryName} trends, insights, and analysis.`,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og-images/${categorySlug}.jpg`, // You can add category-specific images
          width: 1200,
          height: 630,
          alt: `${categoryName} News`,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} News | ${SITE_NAME}`,
      description: `Latest ${categoryName} news and insights for CXOs.`,
      images: [`${SITE_URL}/twitter-images/${categorySlug}.jpg`],
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

/**
 * Generate SEO metadata for article page
 *
 * @param {Object} article - Article data from Strapi
 * @param {string} categorySlug - Category slug
 * @returns {Object} - Next.js metadata object
 */
export function generateArticleMetadata(article, categorySlug) {
  const categoryName = slugToCategoryName(categorySlug);
  const canonicalUrl = `${SITE_URL}/${categorySlug}/${article.slug}`;

  const title = article.title || 'Untitled Article';
  const description = article.description || article.content?.substring(0, 160) || `Read the latest ${categoryName} article on ${SITE_NAME}.`;
  const imageUrl = article.image?.data?.attributes?.url
    ? resolveImageUrl(article.image.data.attributes.url)
    : `${SITE_URL}/default-og-image.jpg`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.authName || 'CXO Team'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      section: categoryName,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },

    // Keywords (if available)
    keywords: article.keywords || `${categoryName}, CXO, technology, business`,

    // Additional SEO
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate JSON-LD structured data for article
 *
 * @param {Object} article - Article data
 * @param {string} categorySlug - Category slug
 * @returns {Object} - JSON-LD object
 */
export function generateArticleStructuredData(article, categorySlug) {
  const categoryName = slugToCategoryName(categorySlug);
  const canonicalUrl = `${SITE_URL}/${categorySlug}/${article.slug}`;
  const imageUrl = article.image?.data?.attributes?.url
    ? resolveImageUrl(article.image.data.attributes.url)
    : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description || '',
    image: imageUrl ? [imageUrl] : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: article.authName || 'CXO Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleSection: categoryName,
  };
}

/**
 * Generate breadcrumb structured data
 *
 * @param {string} categorySlug - Category slug
 * @param {string} articleTitle - Article title (optional)
 * @returns {Object} - JSON-LD breadcrumb object
 */
export function generateBreadcrumbStructuredData(categorySlug, articleTitle = null) {
  const categoryName = slugToCategoryName(categorySlug);

  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: categoryName,
      item: `${SITE_URL}/${categorySlug}`,
    },
  ];

  if (articleTitle) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: articleTitle,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
