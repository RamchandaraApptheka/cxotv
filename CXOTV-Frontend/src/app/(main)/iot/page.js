import Iot from "./Iot";
import { FRONTEND_URL } from '@/utils/env';

export const metadata = {
    title: "IoT News & Connected Enterprise Insights | CXOTV",
    description:
        "IoT news, industrial use cases, and insights shaping connected enterprises and smart operations.",
    keywords:
        "IoT news, connected devices, industrial IoT, smart enterprise",

    alternates: {
        canonical: `${FRONTEND_URL}/iot`,
    },

    openGraph: {
        title: "IoT News & Connected Enterprise Insights | CXOTV",
        description:
            "IoT news, industrial use cases, and insights shaping connected enterprises and smart operations.",
        url: `${FRONTEND_URL}/iot`,
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
                IoT News & Connected Enterprise Insights
            </h1>

            <Iot />
        </>
    );
}
