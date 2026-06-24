/**
 * Google News Sitemap
 * Fetches recent news articles (last 48 hours) for Google News
 * Accessible at /news-sitemap.xml
 */

import { safeFetchJSON } from '@/utils/safeFetch';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';

const STRAPI_API_URL = `${BACKEND_URL}/api/news`;
const BASE_URL = FRONTEND_URL;

/**
 * Fetch recent news articles (last 48 hours)
 */
async function fetchRecentNews() {
  try {
    // Get date 48 hours ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
    const dateFilter = twoDaysAgo.toISOString();

    const url = `${STRAPI_API_URL}?populate=*&pagination[pageSize]=100&sort=publishedAt:DESC&filters[publishedAt][$gte]=${encodeURIComponent(dateFilter)}`;
    const data = await safeFetchJSON(url, { next: { revalidate: 1800 } }, { data: [] });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching recent news for news sitemap:', error);
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
    let categorySlug = 'news';

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
    return `/news/article-${article.id}`;
  }
}

/**
 * Generate Google News sitemap for recent articles
 */
export default async function sitemap() {
  try {
    const news = await fetchRecentNews();

    const newsEntries = news.map((article) => {
      try {
        const attributes = article.attributes;
        const slug = generateArticleSlug(article);

        return {
          url: `${BASE_URL}${slug}`,
          lastModified: attributes?.publishedAt || new Date().toISOString(),
          changeFrequency: 'hourly',
          priority: 1.0, // High priority for recent news
        };
      } catch (error) {
        console.error(`Error processing news article ${article.id}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove null entries

    return newsEntries;
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    return [];
  }
}
