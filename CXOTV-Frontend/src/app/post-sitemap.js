/**
 * Dynamic Post Sitemap
 * Fetches all news articles from Strapi and generates sitemap entries
 * Accessible at /post-sitemap.xml
 */

import { safeFetchJSON } from '@/utils/safeFetch';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';

const STRAPI_API_URL = `${BACKEND_URL}/api/news`;
const BASE_URL = FRONTEND_URL;

/**
 * Fetch all news articles from Strapi
 */
async function fetchAllNews() {
  try {
    // Reduced limit to avoid overwhelming the API during build
    const url = `${STRAPI_API_URL}?populate=*&pagination[pageSize]=500&sort=publishedAt:DESC`;
    const data = await safeFetchJSON(url, { next: { revalidate: 3600 } }, { data: [] });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
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
 * Generate sitemap for all posts
 */
export default async function sitemap() {
  try {
    const news = await fetchAllNews();

    const postEntries = news.map((article) => {
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
        console.error(`Error processing article ${article.id}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove null entries

    return postEntries;
  } catch (error) {
    console.error('Error generating post sitemap:', error);
    return [];
  }
}
