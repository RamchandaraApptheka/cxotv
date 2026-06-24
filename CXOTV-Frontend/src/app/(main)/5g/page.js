// src/app/(main)/5g/page.js
import G5g from "./G5g";
import { FRONTEND_URL } from '@/utils/env';

export const metadata = {
    title: "5G News & Enterprise Innovation | CXOTV",
    description:
        "5G technology news, enterprise use cases, and next-gen connectivity trends for business leaders.",
    keywords: "5G news, enterprise connectivity, 5G trends, CXO technology",
    alternates: {
        canonical: `${FRONTEND_URL}/5g`,
    },
    openGraph: {
        title: "5G News & Enterprise Innovation | CXOTV",
        description:
            "5G technology news, enterprise use cases, and next-gen connectivity trends for business leaders.",
        url: `${FRONTEND_URL}/5g`,
        siteName: "CXOTV",
        type: "website",
    },
};

export default function Page() {
    return <G5g />;
}
