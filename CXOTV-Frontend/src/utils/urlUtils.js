/**
 * URL Utilities for SEO-friendly category/subcategory URLs
 *
 * Handles URL normalization and canonical URL generation
 */

import { slugToCategoryName, categoryNameToSlug } from './categoryUtils';

/**
 * Normalize a URL slug to lowercase for consistency
 * @param {string} slug - The URL slug (may be mixed case)
 * @returns {string} - Lowercase slug
 */
export function normalizeSlug(slug) {
  if (!slug) return '';
  return slug.toLowerCase().trim();
}

/**
 * Get the canonical (preferred) URL format for a category
 * Options: 'lowercase' (recommended) or 'capitalized'
 *
 * @param {string} slug - The category slug
 * @param {string} format - 'lowercase' or 'capitalized'
 * @returns {string} - Formatted slug
 */
export function getCanonicalSlug(slug, format = 'lowercase') {
  const normalized = normalizeSlug(slug);

  if (format === 'capitalized') {
    // Convert to Title Case for URL
    return normalized
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  }

  // Default: lowercase (SEO best practice)
  return normalized;
}

/**
 * Get the display name for a category (for breadcrumbs, titles, etc.)
 * This is what users see in the UI
 *
 * @param {string} slug - The URL slug
 * @returns {string} - Display name
 */
export function getCategoryDisplayName(slug) {
  // Use the mapping to get proper Strapi name
  return slugToCategoryName(slug);
}

/**
 * Generate canonical URL for SEO meta tags
 *
 * @param {string} baseUrl - Base URL (e.g., 'http://localhost:3000')
 * @param {string} categorySlug - Category slug
 * @param {string} articleSlug - Article slug (optional)
 * @param {string} format - 'lowercase' or 'capitalized'
 * @returns {string} - Full canonical URL
 */
export function generateCanonicalUrl(baseUrl, categorySlug, articleSlug = null, format = 'lowercase') {
  const canonicalCategorySlug = getCanonicalSlug(categorySlug, format);

  if (articleSlug) {
    return `${baseUrl}/${canonicalCategorySlug}/${articleSlug}`;
  }

  return `${baseUrl}/${canonicalCategorySlug}`;
}

/**
 * Check if URL needs redirect to canonical version
 *
 * @param {string} currentSlug - Current URL slug
 * @param {string} preferredFormat - 'lowercase' or 'capitalized'
 * @returns {Object} - { needsRedirect: boolean, canonicalSlug: string }
 */
export function checkCanonicalRedirect(currentSlug, preferredFormat = 'lowercase') {
  const canonical = getCanonicalSlug(currentSlug, preferredFormat);

  return {
    needsRedirect: currentSlug !== canonical,
    canonicalSlug: canonical
  };
}

/**
 * Get SEO-friendly metadata for category page
 *
 * @param {string} categorySlug - Category slug
 * @param {string} baseUrl - Base URL
 * @returns {Object} - SEO metadata
 */
export function getCategorySEOMeta(categorySlug, baseUrl = 'https://cxotv.com') {
  const displayName = getCategoryDisplayName(categorySlug);
  const canonicalUrl = generateCanonicalUrl(baseUrl, categorySlug, null, 'lowercase');

  return {
    title: `${displayName} News & Updates | CXO TV`,
    description: `Latest ${displayName} news, insights, and technology updates for business leaders and CXOs.`,
    canonical: canonicalUrl,
    openGraph: {
      title: `${displayName} News | CXO TV`,
      description: `Stay updated with latest ${displayName} trends and insights.`,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} News | CXO TV`,
      description: `Latest ${displayName} news and insights.`,
    }
  };
}

/**
 * Format URL for display (breadcrumbs, etc.)
 *
 * @param {string} slug - URL slug
 * @returns {string} - Formatted display text
 */
export function formatUrlForDisplay(slug) {
  return getCategoryDisplayName(slug);
}
