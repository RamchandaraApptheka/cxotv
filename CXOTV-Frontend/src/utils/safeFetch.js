import { BACKEND_URL } from './env';
/**
 * Safe Fetch Utility for Strapi API
 * Provides automatic retry logic, error handling, and proper caching
 */

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Safe fetch with retry logic and error handling
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<Response>}
 */
export async function safeFetch(url, options = {}, retries = MAX_RETRIES) {
  // Default options - only set cache if not already specified
  const fetchOptions = {
    ...(options.cache === undefined && !options.next ? { cache: 'no-store' } : {}),
    ...options,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error.message);

    if (retries > 0) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY);
      return safeFetch(url, options, retries - 1);
    }

    throw error;
  }
}

/**
 * Safe fetch JSON with automatic error handling
 * Returns empty array or object on error
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {any} fallback - Fallback value on error (default: [])
 * @returns {Promise<any>}
 */
export async function safeFetchJSON(url, options = {}, fallback = []) {
  try {
    const response = await safeFetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch JSON from ${url}:`, error.message);
    return fallback;
  }
}

/**
 * Build Strapi API URL with proper encoding
 * @param {string} endpoint - API endpoint (e.g., '/api/news')
 * @param {object} params - Query parameters
 * @returns {string}
 */
export function buildStrapiURL(endpoint, params = {}) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || BACKEND_URL;
  const url = new URL(endpoint, baseURL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  return url.toString();
}

/**
 * Normalize category name for API queries
 * @param {string} name - Category name
 * @returns {string}
 */
export function normalizeCategoryName(name) {
  if (!name) return '';

  // Convert to lowercase and trim
  return name.toLowerCase().trim();
}
