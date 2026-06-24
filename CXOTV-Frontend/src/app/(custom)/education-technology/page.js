import Education from "./Education";
import { FRONTEND_URL } from '@/utils/env';

export const metadata = {
    title: "Education Technology News & EdTech Trends | CXOTV",
    description:
        "EdTech innovations, digital learning trends, and technology insights shaping modern education.",
    keywords:
        "education technology, EdTech news, digital learning",

    alternates: {
        canonical: `${FRONTEND_URL}/education-technology`,
    },

    openGraph: {
        title: "Education Technology News & EdTech Trends | CXOTV",
        description:
            "EdTech innovations, digital learning trends, and technology insights shaping modern education.",
        url: `${FRONTEND_URL}/education-technology`,
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
            {/* ✅ Required H1 for SEO (hidden but crawlable) */}
            <h1 className="sr-only">
                Education Technology News & EdTech Trends
            </h1>

            <Education />
        </>
    );
}
