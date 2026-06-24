import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
/**
 * EMEA Regional Sitemap Generator
 * Fetches all news articles related to EMEA (Europe, Middle East, Africa)
 * Accessible at /emea-sitemap.xml
 */

export async function GET() {
    const baseUrl = FRONTEND_URL;

    try {
        // Fetch all news articles from EMEA category
        const response = await fetch(
            `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=EMEA&filters[$or][1][subcategories].data[name][$contains]=EMEA&pagination[pageSize]=1000`,
            { next: { revalidate: 3600 } } // Revalidate every hour
        );

        const data = await response.json();
        const articles = data.data || [];

        // Helper function to create SEO-friendly slug
        const toSeoFriendlyUrl = (text) => {
            if (!text) return '';
            return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        };

        // Helper function to get category slug from article
        const getCategorySlug = (article) => {
            const attrs = article.attributes;

            // Try to get category from categories array
            if (attrs.categories?.data?.[0]?.attributes?.name) {
                return toSeoFriendlyUrl(attrs.categories.data[0].attributes.name);
            }

            // Try to get from subcategories
            if (attrs.subcategories?.data?.[0]?.attributes?.name) {
                return toSeoFriendlyUrl(attrs.subcategories.data[0].attributes.name);
            }

            // Default to emea
            return 'emea';
        };

        // Generate XML entries for each article
        const urlEntries = articles.map((article) => {
            const attrs = article.attributes;
            const slug = toSeoFriendlyUrl(attrs.slug || attrs.title);
            const categorySlug = getCategorySlug(article);
            const lastMod = new Date(attrs.updatedAt || attrs.publishedAt).toISOString();

            return `  <url>
    <loc>${baseUrl}/${categorySlug}/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Error generating EMEA sitemap:', error);

        // Return empty sitemap on error
        const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

        return new Response(emptySitemap, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    }
}
