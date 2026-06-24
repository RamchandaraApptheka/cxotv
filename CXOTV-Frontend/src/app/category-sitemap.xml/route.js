import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
/**
 * Category Sitemap Generator
 * Fetches all categories and subcategories and generates a sitemap
 * Accessible at /category-sitemap.xml
 */

export async function GET() {
    const baseUrl = FRONTEND_URL;

    try {
        // Fetch all categories with subcategories
        const response = await fetch(
            `${BACKEND_URL}/api/categories?populate=subcategories&pagination[pageSize]=100`,
            { next: { revalidate: 3600 } } // Revalidate every hour
        );

        const data = await response.json();
        const categories = data.data || [];

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

        const urlEntries = [];

        // Add each category
        categories.forEach((category) => {
            const attrs = category.attributes;
            const categorySlug = toSeoFriendlyUrl(attrs.name);
            const lastMod = new Date(attrs.updatedAt || Date.now()).toISOString();

            // Add main category
            urlEntries.push(`  <url>
    <loc>${baseUrl}/${categorySlug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

            // Add subcategories if they exist
            if (attrs.subcategories?.data) {
                attrs.subcategories.data.forEach((subcategory) => {
                    const subAttrs = subcategory.attributes;
                    const subSlug = toSeoFriendlyUrl(subAttrs.name);
                    const subLastMod = new Date(subAttrs.updatedAt || Date.now()).toISOString();

                    urlEntries.push(`  <url>
    <loc>${baseUrl}/${subSlug}</loc>
    <lastmod>${subLastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
                });
            }
        });

        // Build complete XML sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Error generating category sitemap:', error);

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
