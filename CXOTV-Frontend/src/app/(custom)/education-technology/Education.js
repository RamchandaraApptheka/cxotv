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
import EducationLogo from "../../../../public/assets/Education-Technology-logo.png";
import Ad from "../../(main)/components/Ad";
import CommunityNavbar from "../components/CommunityNavbar";
import NavigationMenu from "@/app/(main)/components/NavigationMenu";

const Education = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const Education = categories.find(
        (category) => category.attributes.name === "Education Technology"
    );

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());
    }, [dispatch]);

    const categoriesWithHeadings1 = [
        { name: "Education Interview", heading: "CXO BYTE" },
        { name: "Steam career education", heading: "STEM/CAREER EDUCATION" },
    ];


    const categoryData = [
        { name: "Education News", title: "EDUCATION IT NEWS" },
        { name: "m learning", title: "VIRTUAL CLASSROOM" },
        { name: "Education Feature", title: "FEATURE" },
        { name: "Skill Development", title: "SKILL DEVELOPMENT" },

    ];

    const names = ["Education News", "m learning", "Education Feature", "Skill Development"];

    // For education
    const educationLinks = [
        { name: "Home", path: "/" },
        { name: "Trending News", path: "/Trending-News" },
        {
            name: "Podcast",

            subLinks: [
                { name: "Education CXO TALK", path: "/Education-CXO-Talk" },

            ],
        },
        { name: "Interviews", path: "/Interviews" },
    ];

    return (
        <div className="flex flex-col w-full">
            <Head>
                <title>Latest Education Technology Video News</title>
                <meta name="description" content="Health technology news and updates" />
            </Head>

            <HeaderAdjust logo={EducationLogo} homePath="/education-technology" />


            {Education && Education.attributes && Education.attributes.subcategories && (
                <NavigationMenu
                    category={Education}
                    subcategories={Education.attributes.subcategories}
                />
            )}

            <Slider category="Education Interview" names={names} />

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

export default Education;