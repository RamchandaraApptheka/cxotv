import { FRONTEND_URL } from '@/utils/env';
// import SearchNews from "./page";


// export async function generateMetadata({ searchParams }) {
//     const searchTerm = searchParams?.q || "";
//     const encodedSearchTerm = encodeURIComponent(searchTerm);
//     const defaultMetadata = {
//         title: `Search Results${searchTerm ? ` for "${searchTerm}"` : ""} - CXOTV Today`,
//         description: searchTerm
//             ? `Find news articles related to "${searchTerm}" on CXOTV Today`
//             : "Search technology news and CXO insights on CXOTV Today",
//         keywords: `${searchTerm}, technology news search, CXO insights search, article finder`,
//     };

//     return {
//         ...defaultMetadata,
//         openGraph: {
//             title: defaultMetadata.title,
//             description: defaultMetadata.description,
//             type: "website",
//             url: `${FRONTEND_URL}/search${searchTerm ? `?q=${encodedSearchTerm}` : ""}`,
//             images: [{
//                 url: `${FRONTEND_URL}/default-search-image.jpg`,
//                 width: 1200,
//                 height: 630,
//                 alt: "CXOTV Search Results",
//             }],
//         },
//         twitter: {
//             card: "summary_large_image",
//             title: defaultMetadata.title,
//             description: defaultMetadata.description,
//             images: [`${FRONTEND_URL}/default-search-image.jpg`],
//         },
//         alternates: {
//             canonical: `${FRONTEND_URL}/search${searchTerm ? `?q=${encodedSearchTerm}` : ""}`
//         }
//     };
// }


// export default function RootLayout({ children }) {
//     return (
//         <SearchNews>
//             {children}
//         </SearchNews>
//     );
// }