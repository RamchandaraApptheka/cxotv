import ALML from "./ALML";
import { FRONTEND_URL } from '@/utils/env';

export const metadata = {
    title: "AI, ML & RPA Enterprise Innovation | CXOTV",
    description:
        "AI, machine learning, and RPA insights driving enterprise automation and business transformation.",
    keywords:
        "AI strategy, machine learning, RPA automation, enterprise AI",

    alternates: {
        canonical: `${FRONTEND_URL}/al-ml-amp-rpa`,
    },

    openGraph: {
        title: "AI, ML & RPA Enterprise Innovation | CXOTV",
        description:
            "AI, machine learning, and RPA insights driving enterprise automation and business transformation.",
        url: `${FRONTEND_URL}/al-ml-amp-rpa`,
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
                AI, ML & RPA Enterprise Innovation
            </h1>

            <ALML />
        </>
    );
}
