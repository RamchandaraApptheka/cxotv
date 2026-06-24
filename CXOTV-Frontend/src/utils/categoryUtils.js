/**
 * Category/Subcategory Name ↔ Slug Conversion Utilities
 *
 * Handles ALL categories and subcategories from Strapi
 * Ensures consistent conversion across CategoryNews and SingleNews components
 */

// Import complete mappings from external file
import { COMPLETE_CATEGORY_MAPPINGS, slugToCategoryNameComplete, categoryNameToSlugComplete } from './categoryMappingsComplete';

// Use complete mappings
const SPECIAL_CATEGORY_MAPPINGS = COMPLETE_CATEGORY_MAPPINGS;

// Reverse mapping: Proper Name → Slug
const REVERSE_CATEGORY_MAPPINGS = Object.entries(SPECIAL_CATEGORY_MAPPINGS).reduce(
  (acc, [slug, name]) => {
    acc[name.toLowerCase()] = slug;
    return acc;
  },
  {}
);

/**
 * Convert a URL slug to the proper category/subcategory name as stored in Strapi
 *
 * @param {string} slug - The URL slug (e.g., "bfsi", "health-technology", "cxo-talk")
 * @returns {string} - The proper category name (e.g., "BFSI", "Health Technology")
 *
 * @example
 * slugToCategoryName("bfsi") // "BFSI"
 * slugToCategoryName("health-technology") // "Health Technology"
 * slugToCategoryName("talks-with-kalpana") // "Talks with Kalpana"
 * slugToCategoryName("apac-cxo-talk") // "APAC CXO Talk"
 */
export const slugToCategoryName = (slug) => {
  return slugToCategoryNameComplete(slug);
};

/**
 * Convert a category/subcategory name to a URL-safe slug
 *
 * @param {string} name - The category name (e.g., "BFSI", "Health Technology", "Talks with Kalpana")
 * @returns {string} - The URL slug (e.g., "bfsi", "health-technology", "talks-with-kalpana")
 *
 * @example
 * categoryNameToSlug("BFSI") // "bfsi"
 * categoryNameToSlug("Health Technology") // "health-technology"
 * categoryNameToSlug("APAC CXO Talk") // "apac-cxo-talk"
 */
export const categoryNameToSlug = (name) => {
  return categoryNameToSlugComplete(name);
};

/**
 * Normalize a category name for comparison (case-insensitive, space-insensitive)
 *
 * @param {string} name - Category name to normalize
 * @returns {string} - Normalized name for comparison
 */
export const normalizeCategoryForComparison = (name) => {
  if (!name) return "";
  return name.toLowerCase().trim().replace(/\s+/g, " ");
};

/**
 * Check if a slug matches a category/subcategory name (case-insensitive)
 *
 * @param {string} slug - The URL slug
 * @param {string} categoryName - The category name from Strapi
 * @returns {boolean} - True if they match
 */
export const doesSlugMatchCategory = (slug, categoryName) => {
  if (!slug || !categoryName) return false;

  const convertedName = slugToCategoryName(slug);
  return normalizeCategoryForComparison(convertedName) ===
         normalizeCategoryForComparison(categoryName);
};

/**
 * Check if a category name exists in an array of category names (case-insensitive)
 *
 * @param {string} searchName - The name to search for
 * @param {string[]} categoryArray - Array of category names
 * @returns {boolean} - True if found
 */
export const categoryExistsInArray = (searchName, categoryArray) => {
  if (!searchName || !Array.isArray(categoryArray)) return false;

  const normalizedSearch = normalizeCategoryForComparison(searchName);
  return categoryArray.some(
    (cat) => normalizeCategoryForComparison(cat) === normalizedSearch
  );
};
