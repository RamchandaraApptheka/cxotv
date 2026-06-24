export const revalidate = 300; // — ISR

import Ad from "../components/Ad";
import TwoCategoryData from "../components/TwoCategoryData";
import NewsCards from "../components/NewsCards";
import CategoryJsonLd from "../components/CategoryJsonLd";
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

export async function generateMetadata() {
    const defaultMetadata = {
        title: "USA Technology News & Insights - CXOTV Today",
        description: "Latest technology updates and executive insights from the United States tech ecosystem",
        keywords: "USA tech news, Silicon Valley updates, American CXO insights, North America technology trends",
    };
    try {
        const response = await fetch(
            `${BACKEND_URL}/api/categories?filters[name][$eq]=USA&populate=*`
        );
        const data = await response.json();
        const category = data.data[0]?.attributes;
        if (!category) return defaultMetadata;
        // Get image URL if available
        const imageUrl = category.image?.data?.attributes?.url
            ? resolveImageUrl(category.image.data.attributes.url)
            : null;
        return {
            title: category.metaTitle || defaultMetadata.title,
            description: category.metaDescription || defaultMetadata.description,
            keywords: category.keywords?.join(", ") || defaultMetadata.keywords,
            openGraph: {
                title: category.metaTitle || defaultMetadata.title,
                description: category.metaDescription || defaultMetadata.description,
                type: "website",
                url: `${FRONTEND_URL}/usa`,
                images: imageUrl
                    ? [
                        {
                            url: imageUrl,
                            width: 1200,
                            height: 630,
                            alt: category.name || "USA Technology News",
                        }
                    ]
                    : [],
            },
            twitter: {
                card: "summary_large_image",
                title: category.metaTitle || defaultMetadata.title,
                description: category.metaDescription || defaultMetadata.description,
                images: imageUrl ? [imageUrl] : [],
            },
        };
    } catch (error) {
        return defaultMetadata;
    }
}


const USA = () => {
    const categoriesWithHeadings1 = [
        { name: "USA Talks with Kalpana", heading: "Talks with Kalpana" },
        { name: "USA Marketing Monday", heading: "Marketing Monday" },
    ];

    const podcasts = [
        { id: 1, name: "USA Marketing Monday" },
        { id: 2, name: "USA CIO Talk" },
        { id: 3, name: "USA CEO Talk" },
        { id: 4, name: "USA CXO Talk" },
        { id: 5, name: "USA INTERVIEWS" },
    ];

    return (
        <div className="flex flex-col gap-3 mx-auto w-full">
            <CategoryJsonLd
                categoryName="USA"
                categoryUrl={`${FRONTEND_URL}/usa`}
                description="Latest news, insights, and trends in the USA from CXO TV."
            />

            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="tech-summit-2023" />
            </div>

            <div className="w-full py-10 px-4 mx-auto items-center bg-[#F3F2F6]">
                <TwoCategoryData
                    active={true}
                    categoriesWithHeadings={categoriesWithHeadings1}
                />
            </div>

            <div>
                <NewsCards categoryName="USA" categoryTitle="Trending News" />
            </div>

            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="Data-cloud" />
            </div>
        </div>
    );
};

export default USA;