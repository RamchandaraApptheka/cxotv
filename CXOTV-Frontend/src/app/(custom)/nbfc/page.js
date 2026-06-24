"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "../../../redux/slices/categoriesSlice";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import HeaderAdjust from '@/app/(main)/components/HeaderAdjust';
import NavigationMenu from "@/app/(main)/components/NavigationMenu";
import LatestNews from "@/app/(main)/components/LatestNews";
import Footer from '@/app/(main)/components/Footer';
import bfsiLogo from "../../../../public/assets/BFSI-Fintech-logo.png";
import cxotalklogo from "../../../../public/assets/cxo-talk-logo.png";
import whiteWall from "../../../../public/assets/page2logo.jpg";
import '../index.css';
import timeAgo from "../../../utils/dateConverter";
import { BACKEND_URL } from '@/utils/env';

// Utility function to convert article titles/slugs to SEO-friendly URLs
const toSeoFriendlyUrl = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Remove leading/trailing spaces
};

const Nbfc = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const [cxoTalkData, setCxoTalkData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // Extract the category name from the URL path
    const categoryName = pathname.split('/').filter(segment => segment).pop();

    const categories = useSelector((state) => state.categories.categories);
    const BFSI = categories.find(
        (category) => category.attributes.name === "BFSI"
    );

    // Calculate translateValue but cap it to prevent moving content too far off-screen
    const translateValue = Math.max(-((scrollPosition / maxScroll) * (maxScroll / 2)), -500);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());
        // Use the categoryName for the document title
        document.title = categoryName ? `${categoryName.replace(/-/g, " ").toUpperCase()}` : 'BFSI CXO TALK';

        // This effect will run when component mounts or when currentPage changes
        fetchCXOTalkData(currentPage);
    }, [dispatch, categoryName, currentPage]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLargeScreen(window.innerWidth >= 1024);

            const handleResize = () => {
                setIsLargeScreen(window.innerWidth >= 1024);
            };

            const handleScroll = () => {
                const currentPosition = window.scrollY;
                setScrollPosition(currentPosition);

                const documentHeight = document.documentElement.scrollHeight;
                const windowHeight = window.innerHeight;
                const maxScroll = documentHeight - windowHeight;
                setMaxScroll(maxScroll);
            };

            window.addEventListener('resize', handleResize);

            if (isLargeScreen) {
                window.addEventListener("scroll", handleScroll);
            }

            return () => {
                window.removeEventListener('resize', handleResize);
                if (isLargeScreen) {
                    window.removeEventListener("scroll", handleScroll);
                }
            };
        }
    }, [isLargeScreen]);

    // Modified styles to ensure the content stays visible
    const divStyles = isLargeScreen
        ? {
            width: "75%",
            height: "auto", // Changed from fixed height to auto
            position: "relative",
            transform: `translateY(${translateValue}px)`,
        }
        : {
            width: "100%",
        };

    const fetchCXOTalkData = async (page = 1) => {
        try {
            setLoading(true);
            // Fixed: Use the dynamic page parameter instead of hardcoded page=1
            const response = await fetch(
                `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=NBFC&filters[$or][1][subcategories].data[name][$eq]=NBFC&pagination[page]=${page}`
            );
            const result = await response.json();

            // Check if data exists before setting state
            if (result.data) {
                setCxoTalkData(result.data);
                setTotalPages(result.meta?.pagination?.pageCount || 1);
            } else {
                console.error("No data received from API:", result);
                setCxoTalkData([]);
                setTotalPages(1);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching CXO Talk data:", error);
            setCxoTalkData([]);
            setLoading(false);
        }
    };

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            // Set loading to true until new data arrives
            setLoading(true);
            // Scroll to top when navigating pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPageNumbers = () => {
        const pageArray = [];
        const maxPagesToShow = 5;

        // No need to render pagination if only one page
        if (totalPages <= 1) return null;

        // Simple pagination when few pages
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageArray.push(
                    <button
                        key={i}
                        className={`mx-2 px-3 py-1 rounded-full ${currentPage === i
                            ? "bg-[#5C39F2] text-white"
                            : "hover:bg-blue-200"
                            }`}
                        onClick={() => handlePageClick(i)}
                        disabled={currentPage === i}
                        aria-current={currentPage === i ? "page" : undefined}
                    >
                        {i}
                    </button>
                );
            }
            return pageArray;
        }

        // Complex pagination with ellipsis for many pages
        const leftEllipsis = currentPage > 3;
        const rightEllipsis = currentPage < totalPages - 2;

        // First page button
        pageArray.push(
            <button
                key={1}
                className={`mx-2 px-6 py-1 rounded-full ${currentPage === 1 ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"
                    }`}
                onClick={() => handlePageClick(1)}
                disabled={currentPage === 1}
                aria-current={currentPage === 1 ? "page" : undefined}
            >
                {1}
            </button>
        );

        // Left ellipsis if needed
        if (leftEllipsis) {
            pageArray.push(
                <span key="leftEllipsis" className="font-bold mx-1">
                    ...
                </span>
            );
        }

        // Middle pages
        const startIndex = leftEllipsis ? Math.max(2, currentPage - 1) : 2;
        const endIndex = rightEllipsis ? Math.min(currentPage + 1, totalPages - 1) : totalPages - 1;

        for (let i = startIndex; i <= endIndex; i++) {
            pageArray.push(
                <button
                    key={i}
                    className={`mx-2 px-6 py-1 rounded-full ${currentPage === i ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"
                        }`}
                    onClick={() => handlePageClick(i)}
                    disabled={currentPage === i}
                    aria-current={currentPage === i ? "page" : undefined}
                >
                    {i}
                </button>
            );
        }

        // Right ellipsis if needed
        if (rightEllipsis) {
            pageArray.push(
                <span key="rightEllipsis" className="font-bold mx-1">
                    ...
                </span>
            );
        }

        // Last page button (only if more than one page)
        if (totalPages > 1) {
            pageArray.push(
                <button
                    key={totalPages}
                    className={`mx-2 px-3 py-1 rounded-full ${currentPage === totalPages
                        ? "bg-[#5C39F2] text-white"
                        : "hover:bg-blue-200"
                        }`}
                    onClick={() => handlePageClick(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-current={currentPage === totalPages ? "page" : undefined}
                >
                    {totalPages}
                </button>
            );
        }

        return pageArray;
    };

    // Update image URLs to use Next.js public environment variable
    const imageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    };

    // Loading state handling
    if (loading && cxoTalkData.length === 0) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            <HeaderAdjust logo={bfsiLogo} homePath="/bfsi" />
            {BFSI && BFSI.attributes && BFSI.attributes.subcategories && (
                <NavigationMenu
                    category={BFSI}
                    subcategories={BFSI.attributes.subcategories}
                />
            )}

            {/* Background Section */}
            <div
                className="lg:flex items-center justify-center lg:h-full h-full"
                style={{
                    backgroundImage: `url(${whiteWall.src})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
            >
                <strong className="flex flex-col lg:w-[60%] w-full items-center justify-center">
                    <p
                        className="lg:text-[68px] text-[15px] lg:h-20 py-20 lg:py-0 text-center font-fira text-white"
                        style={{ paddingTop: "31px" }}
                    >
                        Nbfc
                    </p>
                    <br />
                </strong>
            </div>

            {/* News Grid - Fixed section */}
            <div className="lg:flex gap-10 lg:px-10 px-5 w-full mt-10">
                <div className="lg:w-[75%]" style={divStyles}>
                    {/* Loading indicator for page transitions */}
                    {loading && cxoTalkData.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                            <div className="spinner"></div>
                        </div>
                    )}

                    {/* Debug information */}
                    {(!cxoTalkData || cxoTalkData.length === 0) && !loading && (
                        <div className="text-center text-gray-500 p-4">
                            No articles found
                        </div>
                    )}

                    {/* News grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {cxoTalkData && cxoTalkData.map((item, index) => {
                            // Create SEO-friendly slug for article URLs
                            const seoFriendlySlug = toSeoFriendlyUrl(item.attributes.slug || item.attributes.title);

                            return (
                                <div key={index} className="mb-5">
                                    <Link href={`/${categoryName}/${seoFriendlySlug}`}>
                                        <div className="bg-white shadow-md rounded-md overflow-hidden h-80">
                                            {/* Image section */}
                                            <div className="relative w-full h-40">
                                                {item.attributes.image?.data?.attributes?.url ? (
                                                    <Image
                                                        src={imageUrl(
                                                            item.attributes.image.data.attributes.formats?.small?.url ||
                                                            item.attributes.image.data.attributes.url
                                                        )}
                                                        alt={item.attributes.title}
                                                        width={300}
                                                        height={400}
                                                        className="object-cover"
                                                        loading="lazy"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content section */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                                    {item.attributes.title}
                                                </h3>
                                                <div className="flex justify-between text-sm text-gray-600 items-center mt-4">
                                                    <p>{item.attributes.authName || "Staff Writer"}</p>
                                                    <p>
                                                        {item.attributes.Date
                                                            ? timeAgo(item.attributes.Date)
                                                            : timeAgo(item.attributes.publishedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center py-10">
                            <nav aria-label="Pagination" className="flex items-center">
                                {/* Previous page button */}
                                <button
                                    onClick={() => handlePageClick(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`mx-2 px-4 py-1 rounded-full ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-200"
                                        }`}
                                    aria-label="Previous page"
                                >
                                    &laquo;
                                </button>

                                {/* Page numbers */}
                                {renderPageNumbers()}

                                {/* Next page button */}
                                <button
                                    onClick={() => handlePageClick(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`mx-2 px-4 py-1 rounded-full ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-200"
                                        }`}
                                    aria-label="Next page"
                                >
                                    &raquo;
                                </button>
                            </nav>
                        </div>
                    )}
                </div>

                {/* Latest News Sidebar */}
                <div className="lg:w-[25%] w-full lg:h-[140rem] lg:overflow-y-scroll">
                    <LatestNews categoryName={categoryName} />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Nbfc;