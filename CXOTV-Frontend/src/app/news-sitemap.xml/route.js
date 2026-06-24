import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
/**
 * Google News Sitemap Generator
 * Generates a news-specific sitemap following Google News guidelines
 * Only includes articles from the last 2 days (Google News requirement)
 * Accessible at /news-sitemap.xml
 */

export async function GET() {
    const baseUrl = FRONTEND_URL;

    try {
        // Calculate date 2 days ago (Google News only indexes recent articles)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const twoDaysAgoISO = twoDaysAgo.toISOString();

        // Fetch recent news articles (last 2 days)
        const response = await fetch(
            `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[publishedAt][$gte]=${twoDaysAgoISO}&pagination[pageSize]=100`,
            { next: { revalidate: 1800 } } // Revalidate every 30 minutes
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

            return 'news';
        };

        // Helper function to escape XML special characters
        const escapeXml = (text) => {
            if (!text) return '';
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };

        // Generate XML entries for each article with Google News format
        const urlEntries = articles.map((article) => {
            const attrs = article.attributes;
            const slug = toSeoFriendlyUrl(attrs.slug || attrs.title);
            const categorySlug = getCategorySlug(article);
            const publishDate = new Date(attrs.publishedAt).toISOString();
            const title = escapeXml(attrs.title);
            const authorName = escapeXml(attrs.authName || 'TechPlus Media');

            // Get keywords/tags if available
            const keywords = attrs.tags?.data?.map(tag => escapeXml(tag.attributes.name)).join(', ') || '';

            return `  <url>
    <loc>${baseUrl}/${categorySlug}/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>CXO TV</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishDate}</news:publication_date>
      <news:title>${title}</news:title>${keywords ? `
      <news:keywords>${keywords}</news:keywords>` : ''}
    </news:news>
  </url>`;
        }).join('\n');

        // Build complete XML sitemap with Google News namespace
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=1800, s-maxage=1800', // Cache for 30 minutes
            },
        });
    } catch (error) {
        console.error('Error generating news sitemap:', error);

        // Return empty sitemap on error
        const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;

        return new Response(emptySitemap, {
            headers: {
                'Content-Type': 'application/xml',
            },
        });
    }
}
