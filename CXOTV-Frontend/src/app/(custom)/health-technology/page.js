import Health from "./Health";
import { FRONTEND_URL } from '@/utils/env';

export const metadata = {
    title: "Healthcare Technology News & Innovation | CXOTV",
    description:
        "Healthcare IT, digital health innovation, and technology trends transforming care delivery.",
    keywords:
        "healthcare technology, digital health, health IT news",

    alternates: {
        canonical: `${FRONTEND_URL}/health-technology`,
    },

    openGraph: {
        title: "Healthcare Technology News & Innovation | CXOTV",
        description:
            "Healthcare IT, digital health innovation, and technology trends transforming care delivery.",
        url: `${FRONTEND_URL}/health-technology`,
        siteName: "CXOTV",
        type: "website",
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function Page() {
    return (
        <>
            {/* ✅ SEO-required H1 (hidden but crawlable) */}
            <h1 className="sr-only">
                Healthcare Technology News & Innovation
            </h1>

            <Health />
        </>
    );
}
