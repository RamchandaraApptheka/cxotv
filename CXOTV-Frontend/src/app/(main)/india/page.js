export const revalidate = 300; // — ISR

import Ad from "../components/Ad";
import TwoCategoryData from "../components/TwoCategoryData";
import NewsCards from "../components/NewsCards";
import CategoryJsonLd from "../components/CategoryJsonLd";
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

export async function generateMetadata() {
    const defaultMetadata = {
        title: "INDIA Technology News & Insights - CXOTV Today",
        description: "Latest technology updates and executive insights from the Indian subcontinent",
        keywords: "India tech news, Indian CXO insights, technology trends India, digital transformation India",
    };

    try {
        const response = await fetch(
            `${BACKEND_URL}/api/categories?filters[name][$eq]=INDIA&populate=*`
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
                url: `${FRONTEND_URL}/india`,
                images: imageUrl
                    ? [
                        {
                            url: imageUrl,
                            width: 1200,
                            height: 630,
                            alt: category.name || "INDIA Technology News",
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

const India = () => {
    const categoriesWithHeadings1 = [
        { name: "INDIA Talks with Kalpana", heading: "Talks with Kalpana" },
        { name: "INDIA Marketing Monday", heading: "Marketing Monday" },
    ];

    const podcasts = [
        { id: 1, name: "INDIA Marketing Monday" },
        { id: 2, name: "INDIA CIO Talk" },
        { id: 3, name: "INDIA CEO Talk" },
        { id: 4, name: "INDIA CXO Talk" },
        { id: 5, name: "INDIA INTERVIEWS" },
    ];

    return (
        <div className="flex flex-col gap-3 mx-auto w-full">
            <CategoryJsonLd
                categoryName="INDIA"
                categoryUrl={`${FRONTEND_URL}/india`}
                description="Latest news, insights, and trends in India from CXO TV."
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
                <NewsCards categoryName="INDIA" categoryTitle="Trending News" />
            </div>

            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="Data-cloud" />
            </div>

        </div>
    );
};

export default India;