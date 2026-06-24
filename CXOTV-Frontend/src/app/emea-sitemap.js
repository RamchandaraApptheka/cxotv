/**
 * Dynamic EMEA Regional Sitemap
 * Fetches all news articles from EMEA region and generates sitemap entries
 * Accessible at /emea-sitemap.xml
 */

import { safeFetchJSON } from '@/utils/safeFetch';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';

const STRAPI_API_URL = `${BACKEND_URL}/api/news`;
const BASE_URL = FRONTEND_URL;

/**
 * Fetch all news articles from EMEA region
 */
async function fetchEMEANews() {
  try {
    // Fixed filter syntax: filters[categories][name][$eq]=EMEA
    const url = `${STRAPI_API_URL}?populate=*&pagination[pageSize]=300&sort=publishedAt:DESC&filters[categories][name][$eq]=EMEA`;
    const data = await safeFetchJSON(url, { next: { revalidate: 3600 } }, { data: [] });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching EMEA news for sitemap:', error);
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
    let categorySlug = 'emea';

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
    return `/emea/article-${article.id}`;
  }
}

/**
 * Generate sitemap for EMEA region
 */
export default async function sitemap() {
  try {
    const news = await fetchEMEANews();

    const entries = [
      // Add EMEA category page
      {
        url: `${BASE_URL}/emea`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      // Add all EMEA news articles
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
          console.error(`Error processing EMEA article ${article.id}:`, error);
          return null;
        }
      }).filter(Boolean), // Remove null entries
    ];

    return entries;
  } catch (error) {
    console.error('Error generating EMEA sitemap:', error);
    return [{
      url: `${BASE_URL}/emea`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    }];
  }
}
