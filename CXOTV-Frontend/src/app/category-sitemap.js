/**
 * Dynamic Category Sitemap
 * Fetches all categories and subcategories from Strapi and generates sitemap entries
 * Accessible at /category-sitemap.xml
 */

import { safeFetchJSON } from '@/utils/safeFetch';
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';

const STRAPI_API_URL = `${BACKEND_URL}/api`;
const BASE_URL = FRONTEND_URL;

/**
 * Fetch all categories from Strapi
 */
async function fetchAllCategories() {
  try {
    const url = `${STRAPI_API_URL}/categories?populate=subcategories&pagination[pageSize]=100`;
    const data = await safeFetchJSON(url, { next: { revalidate: 86400 } }, { data: [] });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

/**
 * Fetch all subcategories from Strapi
 */
async function fetchAllSubcategories() {
  try {
    const url = `${STRAPI_API_URL}/subcategories?pagination[pageSize]=200`;
    const data = await safeFetchJSON(url, { next: { revalidate: 86400 } }, { data: [] });
    return data.data || [];
  } catch (error) {
    console.error('Error fetching subcategories for sitemap:', error);
    return [];
  }
}

/**
 * Generate sitemap for all categories and subcategories
 */
export default async function sitemap() {
  try {
    const [categories, subcategories] = await Promise.all([
      fetchAllCategories(),
      fetchAllSubcategories(),
    ]);

    const entries = [];

    // Add category entries
    categories.forEach((category) => {
      const attributes = category.attributes;
      if (attributes?.slug) {
        // Force lowercase for SEO consistency
        const normalizedSlug = attributes.slug.toLowerCase().trim();
        entries.push({
          url: `${BASE_URL}/${normalizedSlug}`,
          lastModified: attributes.updatedAt || new Date().toISOString(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    });

    // Add subcategory entries
    subcategories.forEach((subcategory) => {
      const attributes = subcategory.attributes;
      if (attributes?.slug) {
        // Force lowercase for SEO consistency
        const normalizedSlug = attributes.slug.toLowerCase().trim();
        entries.push({
          url: `${BASE_URL}/${normalizedSlug}`,
          lastModified: attributes.updatedAt || new Date().toISOString(),
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    });

    return entries;
  } catch (error) {
    console.error('Error generating category sitemap:', error);
    return [];
  }
}
