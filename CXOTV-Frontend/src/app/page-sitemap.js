import { FRONTEND_URL } from '@/utils/env';
/**
 * Static Pages Sitemap
 * Contains all static pages like About Us, Privacy Policy, etc.
 * Accessible at /page-sitemap.xml
 */

const BASE_URL = FRONTEND_URL;

/**
 * Generate sitemap for static pages
 */
export default function sitemap() {
  const staticPages = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about-us`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/t-&-c`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/all-news`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  return staticPages;
}
