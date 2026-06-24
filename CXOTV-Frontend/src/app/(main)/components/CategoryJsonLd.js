import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
/**
 * CategoryJsonLd Component
 * Generates structured data (JSON-LD) for category pages to improve SEO
 * This helps search engines understand the page content and display rich results
 */

const CategoryJsonLd = async ({ categoryName, categoryUrl, description }) => {
    try {
        // Fetch the latest 3 articles for this category
        const response = await fetch(
            `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=${encodeURIComponent(categoryName)}&filters[$or][1][subcategories].data[name][$eq]=${encodeURIComponent(categoryName)}&pagination[pageSize]=3`,
            { next: { revalidate: 3600 } } // Revalidate every hour
        );

        const data = await response.json();
        const articles = data.data || [];

        // Build mainEntity array with actual articles from the API
        const mainEntity = articles.map((article) => {
            const attrs = article.attributes;
            const imageUrl = attrs.image?.data?.attributes?.url
                ? resolveImageUrl(attrs.image.data.attributes.url)
                : `${FRONTEND_URL}/logo.png`;

            // Create SEO-friendly slug
            const slug = (attrs.slug || attrs.title)
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

            const articleUrl = `${categoryUrl}/${slug}`;
            const publishedDate = attrs.Date || attrs.publishedAt;
            const modifiedDate = attrs.updatedAt || publishedDate;

            return {
                "@type": "NewsArticle",
                "headline": attrs.title,
                "image": imageUrl,
                "datePublished": new Date(publishedDate).toISOString(),
                "dateModified": new Date(modifiedDate).toISOString(),
                "author": {
                    "@type": "Person",
                    "name": attrs.authName || "Staff Writer"
                },
                "url": articleUrl,
                "description": attrs.description || attrs.title
            };
        });

        // Build the complete JSON-LD schema
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${categoryName} - CXO TV`,
            "url": categoryUrl,
            "description": description,
            "publisher": {
                "@type": "Organization",
                "name": "TechPlus Media",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${FRONTEND_URL}/logo.png`
                }
            },
            "mainEntity": mainEntity,
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": FRONTEND_URL
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": categoryName,
                        "item": categoryUrl
                    }
                ]
            }
        };

        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        );
    } catch (error) {
        console.error(`Error generating JSON-LD for ${categoryName}:`, error);
        // Return null if there's an error to prevent breaking the page
        return null;
    }
};

export default CategoryJsonLd;
