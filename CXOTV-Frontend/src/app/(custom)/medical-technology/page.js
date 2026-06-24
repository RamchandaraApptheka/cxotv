"use client";

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
import health from "../../../../public/assets/Health-Technology-Logo.png";
import whiteWall from "../../../../public/assets/page2logo.jpg";
import '../index.css';
import timeAgo from "../../../utils/dateConverter";
import NavigationMenuthree from "@/app/(main)/components/NavigationMenuthree";
import { BACKEND_URL } from '@/utils/env';

// Utility function to convert article titles/slugs to SEO-friendly URLs
const toSeoFriendlyUrl = (text) => {
    if (!text) return "";
    return String(text)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .trim();
};

// Safe image URL helper
const imageUrl = (url) => {
    if (!url) return "";
    return String(url).startsWith("http") ? url : `${BACKEND_URL}${url}`;
};

const HealthcareItNews = () => {
    const dispatch = useDispatch();
    const pathname = usePathname() || "";
    const [cxoTalkData, setCxoTalkData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // Extract the category name from the URL path (safe)
    const rawCategoryName = (pathname.split("/").filter(Boolean).pop() || "healthcare-it-news");
    // normalize for URL use (don't keep undefined)
    const categoryName = toSeoFriendlyUrl(rawCategoryName);

    // guard categories selector
    const categories = useSelector((state) => state.categories?.categories || []);
    const Health = Array.isArray(categories)
        ? categories.find((category) => category?.attributes?.name === "Health Technology")
        : undefined;

    // Calculate translateValue but cap it to prevent moving content too far off-screen
    const translateValue =
        maxScroll > 0 && Number.isFinite(scrollPosition)
            ? Math.max(-((scrollPosition / maxScroll) * (maxScroll / 2)), -500)
            : 0;

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());

        // safe title set (guard for SSR)
        if (typeof document !== "undefined") {
            document.title = rawCategoryName ? `${rawCategoryName.replace(/-/g, " ").toUpperCase()}` : "Health CXO TALK";
        }

        fetchCXOTalkData(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, currentPage, rawCategoryName]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsLargeScreen(window.innerWidth >= 1024);

            const handleResize = () => {
                setIsLargeScreen(window.innerWidth >= 1024);
            };

            const handleScroll = () => {
                const currentPosition = window.scrollY;
                setScrollPosition(currentPosition);

                const documentHeight = document.documentElement?.scrollHeight || 0;
                const windowHeight = window?.innerHeight || 0;
                const maxScrollLocal = Math.max(documentHeight - windowHeight, 0);
                setMaxScroll(maxScrollLocal);
            };

            window.addEventListener("resize", handleResize);

            if (isLargeScreen) {
                window.addEventListener("scroll", handleScroll);
            }

            return () => {
                window.removeEventListener("resize", handleResize);
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

            // NOTE: ensure filter syntax matches your backend's expected syntax.
            const url = `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=Medical%20Technology&filters[$or][1][subcategories][name][$eq]=Medical%20Technology&pagination[page]=1`;

            const response = await fetch(url);
            const result = await response.json();

            // Check if data exists before setting state
            if (result?.data && Array.isArray(result.data)) {
                setCxoTalkData(result.data);
                setTotalPages(result?.meta?.pagination?.pageCount || 1);
            } else {
                console.warn("No data received from API or unexpected format:", result);
                setCxoTalkData([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching CXO Talk data:", error);
            setCxoTalkData([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            // Set loading to true until new data arrives
            setLoading(true);
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Loading state handling
    if (loading && cxoTalkData.length === 0) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    // Helper: normalize various subcategory shapes to an array
    const normalizeSubcategories = (subcats) => {
        if (!subcats) return [];
        if (Array.isArray(subcats)) return subcats;
        if (Array.isArray(subcats.data)) return subcats.data;
        if (subcats.data && Array.isArray(subcats.data.data)) return subcats.data.data;
        return [];
    };

    // Safe getters for slug / name from different shapes
    const getSlug = (sub) =>
        sub?.attributes?.slug || sub?.slug || sub?.attributes?.name || sub?.name || "";
    const getName = (sub) =>
        sub?.attributes?.name || sub?.name || sub?.attributes?.slug || sub?.slug || "";

    // Build filtered subcategories (exclude health-cxo-talks and anything with "health cxo")
    const rawSubcategories = Health?.attributes?.subcategories;
    const normalized = normalizeSubcategories(rawSubcategories);

    const filteredSubcategories = normalized.filter((sub) => {
        const slug = String(getSlug(sub)).toLowerCase();
        const name = String(getName(sub)).toLowerCase();
        if (slug === "health-cxo-talks") return false;
        if (name.includes("health cxo") || name.includes("health-cxo")) return false;
        return true;
    });

    // Wrap into the shape NavigationMenuthree expects
    const subcategoriesForMenu = { data: filteredSubcategories || [] };

    return (
        <div className="flex flex-col w-full h-full">
            <HeaderAdjust logo={health} homePath="/health-technology" />
            {Health && (
                <NavigationMenuthree
                    category={Health}
                    subcategories={subcategoriesForMenu}
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
                        Medical Technology
                    </p>
                    <br />
                </strong>
            </div>

            {/* News Grid */}
            <div className="lg:flex gap-10 lg:px-10 px-5 w-full mt-10">
                <div className="lg:w-[75%]" style={divStyles}>
                    {/* Loading overlay for page transitions */}
                    {loading && cxoTalkData.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                            <div className="spinner"></div>
                        </div>
                    )}

                    {(!cxoTalkData || cxoTalkData.length === 0) && !loading && (
                        <div className="text-center text-gray-500 p-4">No articles found</div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {Array.isArray(cxoTalkData) &&
                            cxoTalkData.map((item, index) => {
                                const attributes = item?.attributes || {};

                                // prefer item.attributes.slug; if missing, use title; if both missing, fallback to id/index
                                const possible = attributes.slug || attributes.title || item.id || `article-${index}`;
                                const seoFriendlySlug = toSeoFriendlyUrl(possible);

                                // final href - always a non-empty string
                                const href = `/${categoryName}/${seoFriendlySlug}`;

                                // If either categoryName or slug ended up empty, warn and render a non-clickable card
                                const canLink = Boolean(categoryName && seoFriendlySlug);

                                // Choose image url safely
                                const imgAttr = attributes.image?.data?.attributes || null;
                                const imgUrl =
                                    imgAttr?.formats?.small?.url ||
                                    imgAttr?.url ||
                                    imgAttr?.formats?.thumbnail?.url ||
                                    "";

                                if (!seoFriendlySlug || seoFriendlySlug === "") {
                                    // helpful debug - you'll see this in console when data missing
                                    if (typeof window !== "undefined") {
                                        // eslint-disable-next-line no-console
                                        console.warn("Missing slug/title for article, using fallback:", { item });
                                    }
                                }

                                const card = (
                                    <div className="bg-white shadow-md rounded-md overflow-hidden h-80">
                                        <div className="relative w-full h-40">
                                            {imgUrl ? (
                                                <Image
                                                    src={imageUrl(imgUrl)}
                                                    alt={attributes.title || "Article image"}
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

                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{attributes.title}</h3>
                                            <div className="flex justify-between text-sm text-gray-600 items-center mt-4">
                                                <p>{attributes.authName || "Staff Writer"}</p>
                                                <p>{attributes.Date ? timeAgo(attributes.Date) : timeAgo(attributes.publishedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );

                                return (
                                    <div key={item.id ?? index} className="mb-5">
                                        {canLink ? (
                                            <Link href={href}>{card}</Link>
                                        ) : (
                                            // non-clickable fallback (avoid passing undefined href)
                                            <div>{card}</div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center py-10">
                            <nav aria-label="Pagination" className="flex items-center">
                                <button
                                    onClick={() => handlePageClick(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`mx-2 px-4 py-1 rounded-full ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-200"}`}
                                    aria-label="Previous page"
                                >
                                    &laquo;
                                </button>

                                {/* page numbers (reuse your renderPageNumbers if you want) */}
                                {/* simplified small pager */}
                                <span className="mx-2 px-3 py-1 rounded-full bg-[#f0f0f0]">Page {currentPage} / {totalPages}</span>

                                <button
                                    onClick={() => handlePageClick(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`mx-2 px-4 py-1 rounded-full ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-200"}`}
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

export default HealthcareItNews;
