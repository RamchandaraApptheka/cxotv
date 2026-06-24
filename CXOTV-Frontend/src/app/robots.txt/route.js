import { FRONTEND_URL } from '@/utils/env';
/**
 * Robots.txt Generator
 * Tells search engines which pages to crawl and where to find sitemaps
 * Accessible at /robots.txt
 */

export async function GET() {
    const baseUrl = FRONTEND_URL;

    const robotsTxt = `# Robots.txt for CXO TV
# https://cxotv.techplusmedia.com

User-agent: *
Allow: /

# Disallow private/admin pages
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/

# Sitemap Index
Sitemap: ${baseUrl}/sitemap.xml

# Individual Sitemaps
Sitemap: ${baseUrl}/post-sitemap.xml
Sitemap: ${baseUrl}/page-sitemap.xml
Sitemap: ${baseUrl}/category-sitemap.xml
Sitemap: ${baseUrl}/news-sitemap.xml
Sitemap: ${baseUrl}/india-sitemap.xml
Sitemap: ${baseUrl}/apac-sitemap.xml
Sitemap: ${baseUrl}/emea-sitemap.xml
Sitemap: ${baseUrl}/usa-sitemap.xml

# Crawl-delay for polite bots
Crawl-delay: 1
`;

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
        },
    });
}
