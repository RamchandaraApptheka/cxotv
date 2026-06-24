import FourRegionsNews from "./page";
import { FRONTEND_URL } from '@/utils/env';


export async function generateMetadata() {
    const defaultMetadata = {
        title: "Global Tech News Coverage - APAC, EMEA, INDIA & USA | CXOTV Today",
        description: "Comprehensive technology news coverage from key global regions: Asia-Pacific (APAC), Europe/Middle East/Africa (EMEA), India, and United States (USA)",
        keywords: "APAC tech news, EMEA technology updates, India IT coverage, USA tech trends, global CXO insights",
    };

    return {
        ...defaultMetadata,
        openGraph: {
            title: "Worldwide Technology News Coverage | CXOTV Today",
            description: "Stay updated with regional tech developments across APAC, EMEA, India, and USA",
            type: "website",
            url: `${FRONTEND_URL}/global-coverage`,
            images: [{
                url: `${FRONTEND_URL}/default-global-news.jpg`,
                width: 1200,
                height: 630,
                alt: "Global Technology News Coverage",
            }],
        },
        twitter: {
            card: "summary_large_image",
            title: defaultMetadata.title,
            description: defaultMetadata.description,
            images: [`${FRONTEND_URL}/default-global-news.jpg`],
        },
        alternates: {
            canonical: `${FRONTEND_URL}/global-coverage`
        }
    };
}

export default function RootLayout({ children }) {
    return (
        <FourRegionsNews>
            {children}
        </FourRegionsNews>
    );
}