"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/slices/categoriesSlice";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import HeaderAdjust from '@/app/(main)/components/HeaderAdjust';
import '../index.css';
import Footer from '@/app/(main)/components/Footer';
import bfsiLogo from "../../../../public/assets/BFSI-Fintech-logo.png";
import { ReduxProvider } from "../providers";
import CommunityNavbar from '../components/CommunityNavbar';
import Slider from '../components/Slider';
import TwoCategoryData from '../../(main)/components/TwoCategoryData';
import NewsSection from '../../(main)/components/NewsSection';
import NavigationMenu from "@/app/(main)/components/NavigationMenu";

const BFSI = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const BFSI = categories.find(
        (category) => category.attributes.name === "BFSI"
    );

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());
        document.title = 'BFSI News';
    }, [dispatch]);

    const categoriesWithHeadings1 = [
        { name: "CEO Talk", heading: "CXO TALK" },
        { name: "Banking IT", heading: "EVENTS" },
    ];

    const categoryData = [
        { name: "Banking IT", title: "BANKING IT NEWS" },
        { name: "fintech", title: "FINTECH" },
        { name: "NBFC", title: "NBFC" },
        { name: "Trending", title: "FEATURE" },
    ];

    // These was old navbar
    // const bfsLinks = [
    //     { name: "Home", path: "/" },
    //     { name: "Trending News", path: "/trending-news" },
    //     {
    //         name: "Podcast",
    //         subLinks: [
    //             { name: "BFSI CXO TALK", path: "/bfsi-cxo-talk" },
    //             { name: "Interviews", path: "/Interviews" }
    //         ]
    //     },
    //     { name: "Cyber Security", path: "/Cyber-Security" }
    // ];

    const names = ["Banking IT", "fintech", "NBFC", "Trending"];

    return (
        <ReduxProvider>
            <div className="flex flex-col min-h-screen">
                <HeaderAdjust logo={bfsiLogo} homePath="/bfsi" />
                {BFSI && BFSI.attributes && BFSI.attributes.subcategories && (
                    <NavigationMenu
                        category={BFSI}
                        subcategories={BFSI.attributes.subcategories}
                    />
                )}

                <main className="flex-1 max-w-[100rem] mx-auto w-full">
                    <Slider category="BFSI" names={names} />

                    <div className="w-full py-10 px-4 mx-auto items-center bg-[#F3F2F6]">
                        <TwoCategoryData
                            active={true}
                            categoriesWithHeadings={categoriesWithHeadings1}
                        />
                    </div>

                    <NewsSection categoryData={categoryData} />


                </main>

                <Footer />
            </div>
        </ReduxProvider>
    );
};

export default BFSI;