'use client'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { fetchCategories } from "../../../redux/slices/categoriesSlice";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import HeaderAdjust from "../../(main)/components/HeaderAdjust";
import Slider from "../components/Slider";
import TwoCategoryData from "../../(main)/components/TwoCategoryData";
import NewsSection from "../../(main)/components/NewsSection";
import Footer from "../../(main)/components/Footer";
import health from "../../../../public/assets/Health-Technology-Logo.png";
import Ad from "../../(main)/components/Ad";
import CommunityNavbar from "../components/CommunityNavbar";
import NavigationMenuthree from "@/app/(main)/components/NavigationMenuthree";

const Health = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories || []);

    // Find the Health category (guarded)
    const Health = categories.find(
        (category) => category?.attributes?.name === "Health Technology"
    );

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());
    }, [dispatch]);

    // Helper to normalize subcategories to an array
    const normalizeSubcategories = (subcats) => {
        if (!subcats) return [];
        if (Array.isArray(subcats)) return subcats;
        if (Array.isArray(subcats.data)) return subcats.data;
        if (subcats.data && Array.isArray(subcats.data.data)) return subcats.data.data;
        return [];
    };

    // Safe getter for slug/name from various shapes of subcategory item
    const getSlug = (sub) =>
        sub?.attributes?.slug || sub?.slug || sub?.attributes?.name || sub?.name || "";
    const getName = (sub) =>
        sub?.attributes?.name || sub?.name || sub?.attributes?.slug || sub?.slug || "";

    // Build filteredSubcategories only if Health exists
    const rawSubcategories = Health?.attributes?.subcategories;
    const normalized = normalizeSubcategories(rawSubcategories);

    const filteredSubcategories = normalized.filter((sub) => {
        const slug = String(getSlug(sub)).toLowerCase();
        const name = String(getName(sub)).toLowerCase();
        // exclude items with slug 'health-cxo-talks' or name containing 'health cxo'
        if (slug === "health-cxo-talks") return false;
        if (name.includes("health cxo") || name.includes("health-cxo")) return false;
        return true;
    });

    // Wrap filtered array into the shape NavigationMenu expects: { data: [...] }
    const subcategoriesForMenu = { data: filteredSubcategories || [] };

    // Rest of the component remains the same as in React version
    const categoriesWithHeadings1 = [
        { name: "CXO Speak", heading: "CXO SPEAK" },
        { name: "Pharma", heading: "PHARMA" },
    ];

    let categoryData = [
        { name: "Healthcare IT News", title: "HEALTHCARE IT NEWS" },
        { name: "Health Webinars", title: "EVENTS" },
        { name: "Medical Technology", title: "MEDICAL" },
        { name: "Feature", title: "FEATURE" },
    ];

    // Check if /rpa is present (case-insensitive)
    const hasRpa = categoryData.some(
        (item) => String(item.name).toLowerCase() === "/rpa"
    );
    if (!hasRpa) {
        categoryData.push({ name: "/RPA", title: "RPA" });
    } else {
        console.log("/rpa is already present in categoryData");
    }

    const names = [
        "Healthcare IT News",
        "Health Webinars",
        "Medical Technology",
        "Feature",
    ];

    const healthLinks = [
        { name: "Home", path: "/" },
        { name: "Trending News", path: "/Trending-News" },
        {
            name: "Podcast",
            subLinks: [
                // removed Health CXO TALK here to avoid duplication
            ],
        },
        { name: "Interviews", path: "/interviews" },
    ];

    return (
        <div className="flex flex-col w-full">
            <Head>
                <title>Latest Healthcare Technology Video News</title>
                <meta name="description" content="Health technology news and updates" />
            </Head>

            <HeaderAdjust logo={health} homePath="/health-technology" />

            {/* Pass the wrapped object shape so NavigationMenu can safely read .data.some(...) */}
            {Health && (
                <NavigationMenuthree
                    category={Health}
                    subcategories={subcategoriesForMenu}
                />
            )}

            <Slider category="Health Technology" names={names} />

            <div className="w-full py-10 px-4 mx-auto items-center bg-[#F3F2F6]">
                <TwoCategoryData
                    active={true}
                    categoriesWithHeadings={categoriesWithHeadings1}
                />
            </div>

            <div>
                <NewsSection categoryData={categoryData} />
            </div>

            <div className="mx-auto lg:w-[50%] w-full py-6">
                <Ad name="Data-cloud" />
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Health;
