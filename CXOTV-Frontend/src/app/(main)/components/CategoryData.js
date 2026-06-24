'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { fetchNewscategoryAndsubcategory } from "../../../redux/slices/categoryAndsubcategory";
import { fetchCategories } from "../../../redux/slices/categoriesSlice";
import BackgroundImage from "../../../../public/assets/page2logo.jpg";
import LatestNews from "./LatestNews.js";
import timeAgo from "../../../utils/dateConverter";
import { resolveImageUrl } from "../../../utils/resolveImageUrl";
import ceotactlogo from "../../../../public/assets/ceo-talk-logo.png";
import firesidelogo from "../../../../public/assets/talks-with-kalpana-logo.png";
import marketinglogo from "../../../../public/assets/marketing-mondays-logo.png";
import techthursdayLogo from "../../../../public/assets/tech-thursdays-logo.png";
import cxotalklogo from "../../../../public/assets/cxo-talk-logo.png";
import cxoagendaseriesLogo from "../../../../public/assets/cxo-agenda-series-logo.png";
import whiteWall from "../../../../public/assets/white-wall-bg.jpg";

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

const CategoryData = () => {
    const params = useParams();
    const categoryName = params.categoryName;
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const isLargeScreen = useMediaQuery({ minWidth: 1024 });
    const [textSize, setTextSize] = useState("40px");

    const {
        data: newsData,
        isLoading,
        isError,
        totalPages,
    } = useSelector((state) => state.categoryAndsubcategoryNews);

    const categories = useSelector((state) => state.categories.categories);
    const BFSI = categories.find(
        (category) => category.attributes.name === "BFSI"
    );
    const Education = categories.find(
        (category) => category.attributes.name === "Education Technology"
    );
    const Health = categories.find(
        (category) => category.attributes.name === "Health Technology"
    );



    // Fetch categories only once on mount
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Fetch news when categoryName/currentPage/categories change (but only after categories are loaded)
    useEffect(() => {
        if (categoryName && categories && categories.length > 0) {
            // Convert kebab-case URL parameter to space-separated name for API
            const apiNameParam = categoryName.split("-").join(" ");

            // Create a mapping for special case categories
            const categoryNameMapping = {
                "rpa": "RPA",
                "ar-vr": "AR-VR",
                "blockchain": "Blockchain",
                "data": "Data",
                "edge-computing": "Edge Computing",
                "quantum-computing": "Quantum Computing",
                "npl": "NPL",
                "emea-talks-with-kalpana": "EMEA Talks with Kalpana",
                "usa-talks-with-kalpana": "USA Talks with Kalpana",
                "retail-ecommerce": "Retail Ecommerce",
                "telecommunication": "Telecommunication",
                "government-public-sector": "Government Public Sector",
                "media-entertainment": "Media Entertainment",
                "budget-stories": "Budget Stories",
                "daily-news-capsule": "Daily News Capsule",
                "cxo-connect": "CXO Connect",
                "cio-agenda": "CIO Agenda",
                "cxo-agenda": "CXO Agenda",
                "archive": "Archive",
                "tech-connect": "Tech Connect",
                "m-health": "M-Health",
                "business-impact": "Business Impact",
                "case-study": "Case Study",
                "health-cxo-talk": "Health CXO Talk",
                "healthcare-it-news": "Healthcare IT News",
                "education": "Education",
                "talks with kalpana": "Talks with Kalpana",
                "ceo talk": "CEO Talk",
                "marketing mondays": "Marketing Mondays",
                "tech thursday": "Tech Thursday",
                "cxo talk": "CXO Talk",
                "cxo agenda series": "CXO Agenda Series",
                "cfo playbook": "CFO Playbook",
                "search-definition": "Search Definition",
            };

            let formattedNameParam;
            const slugLower = categoryName.toLowerCase();
            const spaceLower = apiNameParam.toLowerCase();

            if (categoryNameMapping[slugLower]) {
                formattedNameParam = categoryNameMapping[slugLower];
            } else if (categoryNameMapping[spaceLower]) {
                formattedNameParam = categoryNameMapping[spaceLower];
            } else {
                // Default capitalization logic
                formattedNameParam = apiNameParam
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ");
            }



            dispatch(
                fetchNewscategoryAndsubcategory({
                    nameParam: formattedNameParam,
                    page: currentPage,
                })
            );
        }
    }, [dispatch, categoryName, currentPage, categories]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isDescriptionCategory = [
                "ceo-talk",
                "talks-with-kalpana",
                "marketing-mondays",
                "tech-thursday"
            ].includes(categoryName);

            if (isDescriptionCategory) {
                setTextSize("15px");
            } else if (isLargeScreen) {
                setTextSize("68px");
            } else {
                setTextSize("40px");
            }
        }
    }, [categoryName, isLargeScreen]);

    // Modified styles to ensure the content stays visible
    const divStyles = isLargeScreen
        ? {
            width: "75%",
            height: "auto", // Changed from fixed height to auto
            position: "relative",
        }
        : {
            width: "100%",
        };

    const getSubcategoryNames = (categoryName, categories) => {
        const category = categories.find(
            (category) => category.attributes.name === categoryName
        );

        if (
            category &&
            category.attributes &&
            category.attributes.subcategories &&
            category.attributes.subcategories.data
        ) {
            const subcategories = category.attributes.subcategories.data;

            // Extract subcategory names
            return subcategories.map((subcategory) => subcategory.attributes.name);
        } else {
            return [];
        }
    };

    const bsfiSubcategoryNames = getSubcategoryNames("BFSI", categories);

    const healthSubcategoryNames = getSubcategoryNames(
        "Health Technology",
        categories
    );
    const educationSubcategoryNames = getSubcategoryNames(
        "Education Technology",
        categories
    );

    const formattedCategoryName = categoryName?.replace(/-/g, " ") || "";

    const belongsToBSFI = bsfiSubcategoryNames.includes(formattedCategoryName);
    const belongsToHealth = healthSubcategoryNames.includes(
        formattedCategoryName
    );
    const belongsToEducation = educationSubcategoryNames.includes(
        formattedCategoryName
    );

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Scroll to top when navigating pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="spinner"></div>
                    <p className="text-gray-500 text-sm">Loading news...</p>
                </div>
            </div>
        );
    } else if (isError) {
        // Fixed: Error state was showing spinner instead of error message
        // This caused the "No news found" impression in the audit
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="flex flex-col items-center gap-4 text-center px-4">
                    <p className="text-red-500 text-lg font-semibold">Unable to load news</p>
                    <p className="text-gray-500 text-sm">There was an error fetching news for this category. Please try again.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-2 bg-[#5C39F2] text-white rounded-md hover:bg-[#4601FA] transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = () => {
        const pageArray = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            return pageNumbers.map((pageNumber) => (
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
            ));
        }

        const leftEllipsis = currentPage > 3;
        const rightEllipsis = currentPage < totalPages - 2;

        pageArray.push(
            <button
                key={1}
                className={`mx-2 px-6 py-1 rounded-full ${currentPage === 1 ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"
                    }`}
                onClick={() => handlePageClick(1)}
            >
                {1}
            </button>
        );

        if (leftEllipsis) {
            pageArray.push(
                <span key="leftEllipsis" className="font-bold">
                    ...
                </span>
            );
        }

        const startIndex = leftEllipsis ? currentPage - 1 : 2;
        const endIndex = rightEllipsis ? currentPage + 1 : totalPages - 1;

        for (let i = startIndex; i <= endIndex; i++) {
            pageArray.push(
                <button
                    key={i}
                    className={`mx-2 px-6 py-1 rounded-full ${currentPage === i ? "bg-[#5C39F2] text-white" : "hover:bg-blue-200"
                        }`}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </button>
            );
        }

        if (rightEllipsis) {
            pageArray.push(<span key="rightEllipsis">...</span>);
        }

        pageArray.push(
            <button
                key={totalPages}
                className={`mx-2 px-3 py-1 rounded ${currentPage === totalPages
                    ? "bg-[#5C39F2] text-white"
                    : "hover:bg-blue-200"
                    }`}
                onClick={() => handlePageClick(totalPages)}
            >
                {totalPages}
            </button>
        );

        return pageArray;
    };

    function customCase(text) {
        return text
            .toLowerCase()                   // normalize
            .split(/\s+/)                    // split on whitespace
            .map(word => {
                if (word.length === 3) {
                    return word.toUpperCase();
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
            })
            .join(' ');
    }

    let backgroundImage;
    let logo;
    let text;
    let textColor = "text-white"; // Default text color
    let logoHeight = "80px"; // Default logo height

    // Make sure categoryName exists before using it in switch
    if (categoryName) {
        // Set background image, logo, text, and logo height based on categoryName
        switch (categoryName) {
            case "ceo-talk":
                backgroundImage = whiteWall;
                logo = ceotactlogo;
                text =
                    "A unique fireside chat platform to capture the pulse of the market and industry sentiments as the global leaders offer directions on the upcoming trends and the relevant strategies and models they are devising to shape a better future.";
                textColor = "text-black";
                break;
            case "talks-with-kalpana":
                backgroundImage = whiteWall;
                logo = firesidelogo;
                text =
                    "An exclusive series that invites leading CXOs and thought leaders from diverse industries to engage in dynamic discussions with Kalpana Singhal, CEO and Chief Editor of Techplus Media and CXO TV.";
                textColor = "text-black";
                logoHeight = "130px";
                break;
            case "marketing-mondays":
                backgroundImage = whiteWall;
                logo = marketinglogo;
                text =
                    "An insightful conversational platform for industry-leading marketing professionals as they unravel the secrets behind successful marketing strategies. This series unlocks the keys to effective marketing and fostering innovation in the ever-evolving landscape of marketing.";
                textColor = "text-black";
                break;
            case "tech-thursday":
                backgroundImage = whiteWall;
                logo = techthursdayLogo;
                text =
                    "A series of panel discussions aimed to foster collaboration, facilitate knowledge exchange, and empower CXOs with the information and strategies they need to tackle the technology challenges and pain areas in their respective roles.";
                textColor = "text-black";
                break;
            case "cxo-talk":
                backgroundImage = whiteWall;
                logo = cxotalklogo;
                break;
            case "cxo-agenda-series":
                backgroundImage = whiteWall;
                logo = cxoagendaseriesLogo;
                break;
            default:
                // Handle default case
                backgroundImage = BackgroundImage; // Default background image
                logo = null;
                // Format the category name for display
                text = formattedCategoryName.charAt(0).toUpperCase() + formattedCategoryName.slice(1); // Use formatted categoryName as default text
                break;
        }
    } else {
        // Default if categoryName is undefined
        backgroundImage = BackgroundImage;
        logo = null;
        text = "Category";
    }

    const maxCharacters = 70;

    return (
        <div className="flex flex-col w-full h-full">
            {/* Background Section */}
            <div
                className="lg:flex items-center justify-center lg:h-full h-full"
                style={{
                    backgroundImage: `url(${backgroundImage.src})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex flex-col lg:w-[60%] w-full items-center justify-center">
                    {logo && (
                        <div className="relative" style={{ height: logoHeight }}>
                            <Image
                                src={logo}
                                alt={text || "Category image"}
                                style={{ objectFit: "contain", position: "relative", height: "auto" }}
                                loading="lazy"
                                width={180}
                                height={90}
                            />
                        </div>
                    )}
                    {text && (
                        <h1
                            style={{ fontSize: textSize }}
                            className={`py-2 mb-[20px] lg:py-0 text-center font-fira ${textColor}`}
                        >
                            {customCase(text)}
                        </h1>
                    )}
                </div>
            </div>

            {/* News Grid - Fixed section */}
            <div className="lg:flex gap-10 lg:px-10 px-5 w-full mt-10">
                <div className="lg:w-[75%] lg:relative" style={divStyles}>
                    {/* Loading or No News Found state */}
                    {(!newsData || newsData.length === 0) && (
                        <div className="text-center p-6 border rounded-md my-4">
                            {isLoading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                                    <p className="text-gray-500">Loading news...</p>
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <p className="text-lg font-medium mb-2">No news found</p>
                                    <p className="text-sm">There are currently no articles available in this category.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* News grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {newsData && newsData.map((item, index) => {
                            // Create SEO-friendly slug for article URLs
                            const seoFriendlySlug = toSeoFriendlyUrl(item.attributes.slug || item.attributes.title);

                            return (
                                <div key={index} className="mb-5">
                                    <Link href={`/${categoryName}/${seoFriendlySlug}`}>
                                        <div className="bg-white shadow-md rounded-md overflow-hidden h-50">
                                            {/* Image section */}
                                            <div className="relative w-full h-40">
                                                {item.attributes.image?.data?.attributes?.url ? (
                                                    <Image
                                                        src={resolveImageUrl(
                                                            item.attributes.image.data.attributes.formats?.small?.url ||
                                                            item.attributes.image.data.attributes.url
                                                        )}
                                                        alt={item.attributes.title}
                                                        fill
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
                                                <div className="font-semibold mb-2 line-clamp-2 text-[14px] sansfont-tech">
                                                    {item.attributes.title}
                                                </div>
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
                            {renderPageNumbers()}
                        </div>
                    )}
                </div>

                {/* Latest News Sidebar */}
                <div className="lg:w-[25%] w-full lg:h-[140rem] lg:overflow-y-scroll">
                    {/* Make sure we pass a string, not an object */}
                    <LatestNews categoryName={categoryName || ""} />
                </div>
            </div>
        </div>
    );
};

export default CategoryData;