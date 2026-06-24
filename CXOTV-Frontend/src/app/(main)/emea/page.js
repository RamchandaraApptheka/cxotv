export const revalidate = 300; // — ISR

import Ad from "../components/Ad";
import TwoCategoryData from "../components/TwoCategoryData";
import NewsCards from "../components/NewsCards";
import CategoryJsonLd from "../components/CategoryJsonLd";
import { BACKEND_URL, FRONTEND_URL } from '@/utils/env';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

export async function generateMetadata() {
    const defaultMetadata = {
        title: "EMEA Technology News & Insights - CXOTV Today",
        description: "Latest technology updates and executive insights from the EMEA region",
        keywords: "EMEA technology, European tech news, Middle East IT updates, Africa digital trends",
    };

    try {
        const response = await fetch(
            `${BACKEND_URL}/api/categories?filters[name][$eq]=EMEA&populate=*`
        );
        const data = await response.json();
        const category = data.data[0]?.attributes;

        if (!category) return defaultMetadata;

        return {
            title: category.metaTitle || defaultMetadata.title,
            description: category.metaDescription || defaultMetadata.description,
            openGraph: {
                type: "website",
                url: `${FRONTEND_URL}/emea`,
                images: category.image?.data?.attributes?.url
                    ? [{
                        url: resolveImageUrl(category.image.data.attributes.url),
                        width: 1200,
                        height: 630
                    }]
                    : []
            }
        };
    } catch (error) {
        return defaultMetadata;
    }
}

const EMEA = () => {
    const categoriesWithHeadings1 = [
        { name: "EMEA Talks with Kalpana", heading: "Talks with Kalpana" },
        { name: "EMEA Marketing Monday", heading: "Marketing Monday" },
    ];

    const podcasts = [
        { id: 1, name: "EMEA Marketing Monday" },
        { id: 2, name: "EMEA CIO Talk" },
        { id: 3, name: "EMEA CEO Talk" },
        { id: 4, name: "EMEA CXO Talk" },
        { id: 5, name: "EMEA INTERVIEWS" },
    ];

    return (
        <div className="flex flex-col gap-3 mx-auto w-full">
            <CategoryJsonLd
                categoryName="EMEA"
                categoryUrl={`${FRONTEND_URL}/emea`}
                description="Latest news, insights, and trends in Europe, Middle East, and Africa from CXO TV."
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
                <NewsCards categoryName="EMEA" categoryTitle="Trending News" />
            </div>

            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="Data-cloud" />
            </div>
        </div>
    );
};

export default EMEA;