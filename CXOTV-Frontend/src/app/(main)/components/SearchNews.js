"use client"

import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { fetchSearchResults } from "../../../redux/slices/searchSlice";
import LatestNews from "../components/LatestNews";
import timeAgo from "../../../utils/dateConverter";
import { useParams } from "next/navigation";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const SearchNews = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    // Get search term from URL params
    const params = useParams();

    const searchData = useSelector((state) => state.search.searchResults);
    const status = useSelector((state) => state.search.status);

    const itemsPerPage = 30;
    const maxCharacters = 105;


    useEffect(() => {
        // Get search term from URL parameter or session storage as fallback
        const paramSearchTerm = params?.searchTerm || "";
        const storedSearchTerm = sessionStorage.getItem("searchTerm") || "";

        // Prioritize URL parameter, fall back to session storage
        const finalSearchTerm = paramSearchTerm || storedSearchTerm;

        // Update state with the search term
        setSearchTerm(finalSearchTerm);

        // Set initial screen size
        setIsLargeScreen(window.innerWidth >= 1024);

        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [params]);

    useEffect(() => {
        if (searchTerm) {
            dispatch(fetchSearchResults(searchTerm));
        }
    }, [dispatch, searchTerm]);



    // Pagination logic remains the same
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentPageData = searchData.slice(startIndex, endIndex);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(searchData.length / itemsPerPage);
    const maxPagesToShow = 5;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const divStyles = isLargeScreen
        ? {
            width: "75%",
            height: "147rem",
            position: "relative",
        }
        : {
            width: "100%",
        };

    // === helper: slugify category name (keeps behaviour similar to middleware) ===
    const slugifyCategory = (name) => {
        if (!name) return null;
        return String(name)
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .replace(/-+/g, "-");
    };
    // ==========================================================================

    return (
        <>
            <div className="lg:flex gap-10 lg:px-10 px-5 w-full mt-10 h-full overflow-hidden shadow-md">
                <div className="lg:w-[75%] lg:relative" style={divStyles}>
                    {searchTerm && (
                        <div className="mb-5">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Search Results for: <span className="text-[#5C39F2]">{searchTerm}</span>
                            </h1>
                        </div>
                    )}

                    <div className="lg:grid lg:grid-cols-3 gap-5">
                        {status === "loading" && <LoadingSpinner />}
                        {status === "failed" && (
                            <p>Error fetching data. Please try again later.</p>
                        )}
                        {searchData.length > 0
                            ? currentPageData.map((item, index) => (
                                <div key={index}>
                                    {/*
                                        ONLY CHANGE: compute the destination using the article's first category name
                                        (falls back to "trending-news" when category is missing).
                                    */}
                                    {(() => {
                                        const slug = item?.attributes?.slug;
                                        // prefer categories[0].attributes.name if present
                                        const categoryName = item?.attributes?.categories?.data?.[0]?.attributes?.name;
                                        const categorySlug = slugifyCategory(categoryName) || "trending-news";
                                        const destination = `/${categorySlug}/${slug}`;
                                        return (
                                            <Link
                                                href={destination}
                                                passHlegacyBehavior
                                            >
                                                <span>
                                                    <div className="w-full lg:h-[330px] h-48 relative rounded-md overflow-hidden">
                                                        {item.attributes.image?.data?.attributes.url ? (
                                                            <div className="w-full lg:h-[330px] h-48 relative rounded-md overflow-hidden">
                                                                <div className="relative h-48 bg-white shadow-md lg:h-80 overflow-y-hidden p-2 rounded-md">
                                                                    <Image
                                                                        src={resolveImageUrl(
                                                                            item.attributes.image.data.attributes
                                                                                .formats?.small?.url ||
                                                                            item.attributes.image.data.attributes.url
                                                                        )}
                                                                        alt={item.attributes.title}
                                                                        className="object-cover lg:h-48 h-30 w-full mb-3 rounded-md"
                                                                        width={300}
                                                                        height={200}
                                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                                        loading="lazy"
                                                                    />
                                                                    <div className="text-sm font-semibold pb-2">
                                                                        <div className="">
                                                                            <p className="lg:h-[60px]">
                                                                                {item.attributes.title.length >
                                                                                    maxCharacters
                                                                                    ? `${item.attributes.title.substring(
                                                                                        0,
                                                                                        maxCharacters
                                                                                    )}...`
                                                                                    : item.attributes.title}
                                                                            </p>
                                                                            <div className="flex justify-between font-semibold items-center py-2">
                                                                                <p>{item.attributes.authName}</p>
                                                                                <p className="lg:py-1 lg:text-[13px] text-[12px]">
                                                                                    {item.attributes.Date
                                                                                        ? timeAgo(item.attributes.Date)
                                                                                        : timeAgo(item.attributes.publishedAt)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full lg:h-[330px] h-48 relative rounded-md overflow-hidden bg-gray-200 ">
                                                                <div className="relative h-48 bg-white lg:h-80 overflow-y-hidden p-2 rounded-md border-gray-200 border-2">
                                                                    <div className="flex items-center justify-center  lg:h-48 h-30 w-full">
                                                                        <span className="text-gray-700 ">No image</span>
                                                                    </div>

                                                                    <div className="text-sm font-semibold pb-2">
                                                                        <div className="">
                                                                            <p className="lg:h-[60px]">
                                                                                {item.attributes.title.length >
                                                                                    maxCharacters
                                                                                    ? `${item.attributes.title.substring(
                                                                                        0,
                                                                                        maxCharacters
                                                                                    )}...`
                                                                                    : item.attributes.title}
                                                                            </p>
                                                                            <div className="flex justify-between font-semibold items-center py-2">
                                                                                <p>{item.attributes.authName}</p>
                                                                                <p className="lg:py-1 lg:text-[13px] text-[12px]">
                                                                                    {item.attributes.Date
                                                                                        ? timeAgo(item.attributes.Date)
                                                                                        : timeAgo(item.attributes.publishedAt)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </span>
                                            </Link>
                                        );
                                    })()}
                                </div>
                            ))
                            : status === "succeeded" && (
                                <div className="lg:col-span-3 text-center mt-10">
                                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                                        {`No news found for "${searchTerm}".`}
                                    </h2>
                                    <p className="text-lg text-gray-700">
                                        {` We couldn't find any news articles matching your search
                                        term. Please try a different search term or check back
                                        later.`}
                                    </p>
                                </div>
                            )}
                    </div>

                    <div className="flex justify-center py-10">
                        {getPageNumbers().map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`mx-2 px-3 py-1 rounded-full ${currentPage === pageNumber
                                    ? "bg-[#5C39F2] text-white"
                                    : "hover:bg-blue-200"
                                    }`}
                                onClick={() => handlePageClick(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="lg:w-[25%] w-full lg:h-[145rem] lg:overflow-y-scroll">
                    <LatestNews />
                </div>
            </div>
        </>
    );
};

export default SearchNews;
