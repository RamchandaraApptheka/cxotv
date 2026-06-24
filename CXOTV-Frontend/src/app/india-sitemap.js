/**
 * Dynamic India Regional Sitemap
 * Fetches all news articles from India region and generates sitemap entries
 * Accessible at /india-sitemap.xml
 */

import { safeFetchJSON } from '@/utils/safeFetch';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';

const STRAPI_API_URL = `${BACKEND_URL}/api/news`;
const BASE_URL = FRONTEND_URL;

/**
 * Fetch all news articles from India region
 */
async function fetchIndiaNews() {
  try {
    // Fixed filter syntax: filters[categories][name][$eq]=INDIA
    const url = `${STRAPI_API_URL}?populate=*&pagination[pageSize]=300&sort=publishedAt:DESC&filters[categories][name][$eq]=INDIA`;
    const data = await safeFetchJSON(url, { next: { revalidate: 3600 } }, { data: [] });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching India news for sitemap:', error);
    return [];
  }
}

/**
 * Generate slug from article data
 */
function generateArticleSlug(article) {
  try {
    const attributes = article.attributes;

    // Try to get category or subcategory slug
    let categorySlug = 'india';

    if (attributes?.categories?.data?.[0]?.attributes?.slug) {
      categorySlug = attributes.categories.data[0].attributes.slug;
    } else if (attributes?.subcategories?.data?.[0]?.attributes?.slug) {
      categorySlug = attributes.subcategories.data[0].attributes.slug;
    }

    // Get article slug
    const articleSlug = attributes?.slug || `article-${article.id}`;

    // Force lowercase for SEO consistency
    return `/${categorySlug.toLowerCase().trim()}/${articleSlug.toLowerCase().trim()}`;
  } catch (error) {
    console.error('Error generating article slug:', error);
    return `/india/article-${article.id}`;
  }
}

/**
 * Generate sitemap for India region
 */
export default async function sitemap() {
  try {
    const news = await fetchIndiaNews();

    const entries = [
      // Add India category page
      {
        url: `${BASE_URL}/india`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      // Add all India news articles
      ...news.map((article) => {
        try {
          const attributes = article.attributes;
          const slug = generateArticleSlug(article);

          return {
            url: `${BASE_URL}${slug}`,
            lastModified: attributes?.updatedAt || attributes?.publishedAt || new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.7,
          };
        } catch (error) {
          console.error(`Error processing India article ${article.id}:`, error);
          return null;
        }
      }).filter(Boolean), // Remove null entries
    ];

    return entries;
  } catch (error) {
    console.error('Error generating India sitemap:', error);
    return [{
      url: `${BASE_URL}/india`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    }];
  }
}
