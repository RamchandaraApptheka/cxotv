import { BACKEND_URL } from './env';
/**
 * Image URL Resolver
 *
 * Handles three categories of image URLs that exist across the article DB:
 *
 * 1. New uploads (post-S3 migration): already absolute https://cdn.* URLs
 *    → pass through unchanged
 *
 * 2. Old Strapi uploads (pre-migration): relative paths like /uploads/image.jpg
 *    → prepend NEXT_PUBLIC_UPLOAD_URL (cdn.cxotv.techplusmedia.com after cutover,
 *      or apicxotv.techplusmedia.com as legacy fallback)
 *
 * 3. Hard-coded legacy absolute URLs (https://apicxotv.techplusmedia.com/uploads/...)
 *    → rewrite the host to cdn.cxotv.techplusmedia.com when CDN is active
 *
 * Usage:
 *   import { resolveImageUrl } from '@/utils/resolveImageUrl';
 *   const src = resolveImageUrl(item.image?.data?.attributes?.url);
 */

const CDN_BASE = process.env.NEXT_PUBLIC_UPLOAD_URL || BACKEND_URL;
const LEGACY_STRAPI_HOST = 'https://apicxotv.techplusmedia.com';

/**
 * Resolves a Strapi image URL to the correct public URL.
 * @param {string|null|undefined} url - Raw URL from Strapi attributes
 * @returns {string|null}
 */
export function resolveImageUrl(url) {
  if (!url) return null;

  // Already a fully qualified URL
  if (url.startsWith('http')) {
    // Rewrite legacy apicxotv.* host to CDN when CDN is active
    if (
      CDN_BASE !== LEGACY_STRAPI_HOST &&
      url.startsWith(LEGACY_STRAPI_HOST)
    ) {
      return url.replace(LEGACY_STRAPI_HOST, CDN_BASE);
    }
    return url;
  }

  // Relative path (most common from Strapi local uploads)
  return `${CDN_BASE}${url.startsWith('/') ? url : `/${url}`}`;
}

/**
 * Resolves an image URL from a Strapi image attribute object.
 * Handles both flat and nested (formats) structures.
 * @param {object|null|undefined} imageAttr - Strapi image attributes object
 * @param {'medium'|'small'|'thumbnail'|'large'} [preferFormat] - Preferred format
 * @returns {string|null}
 */
export function resolveImageAttr(imageAttr, preferFormat = 'medium') {
  if (!imageAttr) return null;

  // Try preferred format first (smaller payload)
  const formatUrl = imageAttr?.formats?.[preferFormat]?.url;
  if (formatUrl) return resolveImageUrl(formatUrl);

  // Fall back to original URL
  return resolveImageUrl(imageAttr?.url);
}
