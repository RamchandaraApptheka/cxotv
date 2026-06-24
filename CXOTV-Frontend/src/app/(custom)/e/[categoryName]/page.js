"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "../../../../redux/slices/categoriesSlice";
import { fetchCustomAds } from "../../../../redux/slices/customAdsSlice";
import HeaderAdjust from '@/app/(main)/components/HeaderAdjust';
import NavigationMenu from "@/app/(main)/components/NavigationMenu";
import LatestNews from "@/app/(main)/components/LatestNews";
import Footer from '@/app/(main)/components/Footer';
import health from "../../../../../public/assets/Health-Technology-Logo.png";
import EducationLogo from "../../../../../public/assets/Education-Technology-logo.png";
import whiteWall from "../../../../../public/assets/page2logo.jpg";
import '../../index.css';
import timeAgo from "../../../../utils/dateConverter";
import CategoryData from "@/app/(main)/components/CategoryData";
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

// Utility function to format category name according to specified rules
const formatCategoryName = (categoryName) => {
    if (!categoryName) return '';

    // Split the category name by hyphens
    const parts = categoryName.split('-');

    // Process each part
    const formattedParts = parts.map((part, index) => {
        // If it's the first part and exactly 3 letters, make it all uppercase
        if (index === 0 && part.length === 3) {
            return part.toUpperCase();
        }
        // Otherwise, capitalize the first letter of each part
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });

    // Join the parts back with hyphens
    return formattedParts.join('-');
};

const Educato = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const params = useParams(); // Get params from URL
    const [cxoTalkData, setCxoTalkData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [displayText, setDisplayText] = useState(""); // State to store text from params
    const [formattedCategoryName, setFormattedCategoryName] = useState(""); // State for formatted category name

    // Extract the category name from the URL path
    const categoryName = pathname.split('/').filter(segment => segment).pop();

    const categories = useSelector((state) => state.categories.categories);
    const Education = categories.find(
        (category) => category.attributes.name === "Education Technology"
    );

    // Calculate translateValue but cap it to prevent moving content too far off-screen
    const translateValue = Math.max(-((scrollPosition / maxScroll) * (maxScroll / 2)), -500);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());

        // Extract text from params if available
        if (params.text) {
            // URL decode the text from params
            setDisplayText(decodeURIComponent(params.text));
        }

        // Format the category name from params
        if (params.categoryName) {
            setFormattedCategoryName(formatCategoryName(params.categoryName));
        }

        // Use the categoryName for the document title
        document.title = categoryName ? `${categoryName.replace(/-/g, " ").toUpperCase()}` : 'Health CXO TALK';

        // This effect will run when component mounts or when currentPage changes
        fetchCXOTalkData(currentPage);
    }, [dispatch, categoryName, currentPage, params]);

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
            height: "auto",
            position: "relative",
            transform: `translateY(${translateValue}px)`,
        }
        : {
            width: "100%",
        };

    const fetchCXOTalkData = async (page = 1) => {
        try {
            setLoading(true);
            // Changed endpoint to fetch health-related articles instead of fintech
            const response = await fetch(
                `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=Health%20CXO%20Talk&filters[$or][1][subcategories][name][$eq]=Health%20CXO%20Talk&pagination[page]=1`
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
            <HeaderAdjust logo={EducationLogo} homePath="/education-technology" />
            {Education && Education.attributes && Education.attributes.subcategories && (
                <NavigationMenu
                    category={Education}
                    subcategories={Education.attributes.subcategories}
                />
            )}

            {/* Pass the formatted category name to CategoryData */}
            <CategoryData categoryName={formattedCategoryName} />

            <Footer />
        </div>
    );
};

export default Educato;