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
import whiteWall from "../../../../public/assets/page2logo.jpg";
import timeAgo from "../../../utils/dateConverter";
import { BACKEND_URL } from '@/utils/env';

const toSeoFriendlyUrl = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

const RpaPage = () => {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const [rpaData, setRpaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    const categoryName = pathname.split('/').filter(segment => segment).pop();

    useEffect(() => {
        console.log('[RPA] useEffect: dispatching fetchCategories, fetchCustomAds, setting title, and fetching RPA data. currentPage:', currentPage, 'categoryName:', categoryName);
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());
        document.title = categoryName ? `${categoryName.replace(/-/g, " ").toUpperCase()}` : 'RPA';
        fetchRPAData(currentPage);
    }, [dispatch, categoryName, currentPage]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLargeScreen(window.innerWidth >= 1024);
            const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
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

    const divStyles = isLargeScreen
        ? { width: "75%", height: "auto", position: "relative", transform: `translateY(${Math.max(-((scrollPosition / maxScroll) * (maxScroll / 2)), -500)}px)` }
        : { width: "100%" };

    const fetchRPAData = async (page = 1) => {
        try {
            console.log('[RPA] fetchRPAData: Fetching page', page);
            setLoading(true);
            const url = `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=RPA&filters[$or][1][subcategories].data[name][$eq]=RPA&pagination[page]=${page}`;
            console.log('[RPA] fetchRPAData: Fetch URL', url);
            const response = await fetch(url);
            const result = await response.json();
            console.log('[RPA] fetchRPAData: API result', result);
            if (result.data) {
                setRpaData(result.data);
                setTotalPages(result.meta?.pagination?.pageCount || 1);
                console.log('[RPA] fetchRPAData: Data set. Items:', result.data.length, 'TotalPages:', result.meta?.pagination?.pageCount);
            } else {
                setRpaData([]);
                setTotalPages(1);
                console.warn('[RPA] fetchRPAData: No data in result');
            }
            setLoading(false);
        } catch (error) {
            setRpaData([]);
            setLoading(false);
            console.error('[RPA] fetchRPAData: Error fetching data', error);
        }
    };

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            setLoading(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPageNumbers = () => {
        const pageArray = [];
        const maxPagesToShow = 5;
        if (totalPages <= 1) return null;
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageArray.push(
                    <button key={i} className={`mx-2 px-3 py-1 rounded-full ${currentPage === i ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"}`} onClick={() => handlePageClick(i)} disabled={currentPage === i} aria-current={currentPage === i ? "page" : undefined}>{i}</button>
                );
            }
            return pageArray;
        }
        const leftEllipsis = currentPage > 3;
        const rightEllipsis = currentPage < totalPages - 2;
        pageArray.push(
            <button key={1} className={`mx-2 px-6 py-1 rounded-full ${currentPage === 1 ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"}`} onClick={() => handlePageClick(1)} disabled={currentPage === 1} aria-current={currentPage === 1 ? "page" : undefined}>{1}</button>
        );
        if (leftEllipsis) pageArray.push(<span key="leftEllipsis" className="font-bold mx-1">...</span>);
        const startIndex = leftEllipsis ? Math.max(2, currentPage - 1) : 2;
        const endIndex = rightEllipsis ? Math.min(currentPage + 1, totalPages - 1) : totalPages - 1;
        for (let i = startIndex; i <= endIndex; i++) {
            pageArray.push(
                <button key={i} className={`mx-2 px-6 py-1 rounded-full ${currentPage === i ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"}`} onClick={() => handlePageClick(i)} disabled={currentPage === i} aria-current={currentPage === i ? "page" : undefined}>{i}</button>
            );
        }
        if (rightEllipsis) pageArray.push(<span key="rightEllipsis" className="font-bold mx-1">...</span>);
        if (totalPages > 1) {
            pageArray.push(
                <button key={totalPages} className={`mx-2 px-3 py-1 rounded-full ${currentPage === totalPages ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"}`} onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages} aria-current={currentPage === totalPages ? "page" : undefined}>{totalPages}</button>
            );
        }
        return pageArray;
    };

    const imageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${BACKEND_URL}${url}`;
    };

    if (loading && rpaData.length === 0) {
        console.log('[RPA] Rendering: Loading state (no data yet)');
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full">
            <HeaderAdjust />
            <NavigationMenu />
            {/* Background Section */}
            <div className="lg:flex items-center justify-center lg:h-full h-full" style={{backgroundImage: `url(${whiteWall.src})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>
                <strong className="flex flex-col lg:w-[60%] w-full items-center justify-center">
                    <p className="lg:text-[68px] text-[15px] lg:h-20 py-2 lg:py-0 text-center font-fira text-white">RPA</p>
                    <br />
                </strong>
            </div>
            {/* News Grid - Fixed section */}
            <div className="lg:flex gap-10 lg:px-10 px-5 w-full mt-10">
                <div className="lg:w-[75%]" style={divStyles}>
                    {/* Loading indicator for page transitions */}
                    {loading && rpaData.length > 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                            <div className="spinner"></div>
                        </div>
                    )}
                    {/* Debug information */}
                    {(!rpaData || rpaData.length === 0) && !loading && (
                        console.log('[RPA] Rendering: No articles found'),
                        <div className="text-center text-gray-500 p-4">No articles found</div>
                    )}
                    {/* News grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {rpaData && rpaData.map((item, index) => {
                            const seoFriendlySlug = toSeoFriendlyUrl(item.attributes.slug || item.attributes.title);
                            return (
                                <div key={index} className="mb-5">
                                    <Link href={`/${categoryName}/${seoFriendlySlug}`}>
                                        <div className="bg-white shadow-md rounded-md overflow-hidden h-80">
                                            {/* Image section */}
                                            <div className="relative w-full h-40">
                                                {item.attributes.image?.data?.attributes?.url ? (
                                                    <Image
                                                        src={imageUrl(item.attributes.image.data.attributes.formats?.small?.url || item.attributes.image.data.attributes.url)}
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
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.attributes.title}</h3>
                                                <div className="flex justify-between text-sm text-gray-600 items-center mt-4">
                                                    <p>{item.attributes.authName || "Staff Writer"}</p>
                                                    <p>{item.attributes.Date ? timeAgo(item.attributes.Date) : timeAgo(item.attributes.publishedAt)}</p>
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
                                <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} className={`mx-2 px-4 py-1 rounded-full ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-200"}`} aria-label="Previous page">&laquo;</button>
                                {renderPageNumbers()}
                                <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} className={`mx-2 px-4 py-1 rounded-full ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-blue-200"}`} aria-label="Next page">&raquo;</button>
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

export default RpaPage;
