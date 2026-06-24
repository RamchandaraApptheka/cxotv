import '../index.css';
import Image from 'next/image';
import { FRONTEND_URL } from '@/utils/env';

export async function generateMetadata() {
    return {
        title: 'BFSI & Fintech News - CXOTV Today',
        description: 'Latest banking, financial services and fintech news, insights and trends',
        keywords: 'BFSI, fintech, banking IT, financial services, digital banking',
        alternates: {
            canonical: `${FRONTEND_URL}/bfsi`,
        },
        openGraph: {
            title: 'BFSI & Fintech News - CXOTV Today',
            description: 'Latest banking, financial services and fintech news, insights and trends',
            type: 'website',
            url: `${FRONTEND_URL}/bfsi`,
        },
        twitter: {
            card: 'summary_large_image',
            title: 'BFSI & Fintech News - CXOTV Today',
            description: 'Latest banking, financial services and fintech news, insights and trends',
        },
    };
}

export default function CustomLayout({ children, logo }) {
    return (
        <div className="flex flex-col min-h-screen">
            {logo && (
                <div className="py-4 px-6 border-b">
                    <Image
                        src={logo.src}
                        alt="Logo"
                        className="h-12 w-auto"
                        width={120}
                        height={48}
                        priority
                    />
                </div>
            )}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}