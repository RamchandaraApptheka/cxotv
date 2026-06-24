import { FRONTEND_URL } from '@/utils/env';
/**
 * Main Sitemap Index
 * Returns a sitemap index that references all sub-sitemaps
 * Next.js will automatically generate this at /sitemap.xml
 */
export default function sitemap() {
    const baseUrl = FRONTEND_URL;
    const currentDate = new Date().toISOString();

    return [
        {
            url: `${baseUrl}/post-sitemap.xml`,
            lastModified: currentDate,
        },
        {
            url: `${baseUrl}/page-sitemap.xml`,
            lastModified: currentDate,
        },
        {
            url: `${baseUrl}/category-sitemap.xml`,
            lastModified: currentDate,
        },
        {
            url: `${baseUrl}/news-sitemap.xml`,
            lastModified: currentDate,
        },
        {
            url: `${baseUrl}/india-sitemap.xml`,
            lastModified: currentDate,
        },
        {
            url: `${baseUrl}/apac-sitemap.xml`,
            lastModified: currentDate,
        },
        {
            url: `${baseUrl}/emea-sitemap.xml`,
            lastModified: currentDate,
        },
        {
            url: `${baseUrl}/usa-sitemap.xml`,
            lastModified: currentDate,
        },
    ];
}
