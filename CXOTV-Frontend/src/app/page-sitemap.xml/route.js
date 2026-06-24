import { FRONTEND_URL } from '@/utils/env';
/**
 * Page Sitemap Generator
 * Lists all static pages of the website
 * Accessible at /page-sitemap.xml
 */

export async function GET() {
    const baseUrl = FRONTEND_URL;
    const currentDate = new Date().toISOString();

    // Define all static pages with their priorities
    const staticPages = [
        { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
        { url: '/about-us', priority: '0.8', changefreq: 'monthly' },
        { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
        { url: '/t-&-c', priority: '0.5', changefreq: 'yearly' },
        { url: '/india', priority: '0.9', changefreq: 'daily' },
        { url: '/apac', priority: '0.9', changefreq: 'daily' },
        { url: '/emea', priority: '0.9', changefreq: 'daily' },
        { url: '/usa', priority: '0.9', changefreq: 'daily' },
        { url: '/bfsi', priority: '0.8', changefreq: 'daily' },
        { url: '/health-technology', priority: '0.8', changefreq: 'daily' },
        { url: '/education-technology', priority: '0.8', changefreq: 'daily' },
        { url: '/advertising', priority: '0.7', changefreq: 'weekly' },
        { url: '/cxo-speak', priority: '0.8', changefreq: 'daily' },
        { url: '/fintech', priority: '0.8', changefreq: 'daily' },
        { url: '/banking-it', priority: '0.8', changefreq: 'daily' },
        { url: '/nbfc', priority: '0.8', changefreq: 'daily' },
        { url: '/bfsi-technology', priority: '0.8', changefreq: 'daily' },
        { url: '/bfsi-cxo-talk', priority: '0.8', changefreq: 'daily' },
        { url: '/healthcare-it-news', priority: '0.8', changefreq: 'daily' },
        { url: '/health-videos', priority: '0.8', changefreq: 'daily' },
        { url: '/edtech', priority: '0.8', changefreq: 'daily' },
        { url: '/rpa', priority: '0.8', changefreq: 'daily' },
    ];

    // Generate XML entries for each page
    const urlEntries = staticPages.map((page) => {
        return `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }).join('\n');

    // Build complete XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
        },
    });
}
