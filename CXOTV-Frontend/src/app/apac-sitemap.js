/**
 * Dynamic APAC Regional Sitemap
 * Fetches all news articles from APAC region and generates sitemap entries
 * Accessible at /apac-sitemap.xml
 */

import { safeFetchJSON } from '@/utils/safeFetch';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';

const STRAPI_API_URL = `${BACKEND_URL}/api/news`;
const BASE_URL = FRONTEND_URL;

/**
 * Fetch all news articles from APAC region
 */
async function fetchAPACNews() {
  try {
    // Fixed filter syntax: filters[categories][name][$eq]=APAC
    const url = `${STRAPI_API_URL}?populate=*&pagination[pageSize]=300&sort=publishedAt:DESC&filters[categories][name][$eq]=APAC`;
    const data = await safeFetchJSON(url, { next: { revalidate: 3600 } }, { data: [] });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching APAC news for sitemap:', error);
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
    let categorySlug = 'apac';

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
    return `/apac/article-${article.id}`;
  }
}

/**
 * Generate sitemap for APAC region
 */
export default async function sitemap() {
  try {
    const news = await fetchAPACNews();

    const entries = [
      // Add APAC category page
      {
        url: `${BASE_URL}/apac`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      // Add all APAC news articles
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
          console.error(`Error processing APAC article ${article.id}:`, error);
          return null;
        }
      }).filter(Boolean), // Remove null entries
    ];

    return entries;
  } catch (error) {
    console.error('Error generating APAC sitemap:', error);
    return [{
      url: `${BASE_URL}/apac`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.9,
    }];
  }
}
