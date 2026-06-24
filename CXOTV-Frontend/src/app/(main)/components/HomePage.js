"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomAds, setAds } from "../../../redux/slices/customAdsSlice";
import { setCategories } from "../../../redux/slices/categoriesSlice";
import { setNavbars } from "../../../redux/slices/navbarSlice";
import { setSectionNews } from "../../../redux/slices/sectionSlice";
import { setShortsUrl } from "../../../redux/slices/youtubeSlice";
import { setBulkNewsData } from "../../../redux/slices/newsSlice";
import dynamic from 'next/dynamic';
import "../globals.css";
import { Suspense } from "react";
import {
    categoryData,
    categoriesWithHeadings1,
    categoriesWithHeadings2,
    names,
    sliderLeft
} from "@/utils/homePageConfig";

const Section = dynamic(() => import("./Section"), {
    loading: () => <div className="w-full px-4 py-6 min-h-[400px]" />,
});
const HomeSlider = dynamic(() => import("./HomeSlider.js"), {
    loading: () => <div className="w-full px-4 py-3 min-h-[300px] lg:min-h-[400px]" />,
});
const Ad = dynamic(() => import("./Ad.js"), {
    loading: () => <div className="w-full aspect-[8/1] bg-[#F3F2F6] animate-pulse rounded-md" />,
});
const NewsSection = dynamic(() => import("./NewsSection.js"), {
    loading: () => <div className="w-full min-h-[600px] px-5" />,
});
const TwoCategoryData = dynamic(() => import("./TwoCategoryData.js"), {
    loading: () => <div className="w-full min-h-[250px] px-4" />,
});

const HomePage = ({ serverData }) => {
    const dispatch = useDispatch();
    const { isAdLoading, isError } = useSelector((state) => state.customAds);

    useEffect(() => {
        if (serverData) {
            if (serverData.ads && serverData.ads.length > 0) {
                dispatch(setAds(serverData.ads));
            }
            if (serverData.categories && serverData.categories.length > 0) {
                dispatch(setCategories(serverData.categories));
            }
            if (serverData.navbars && serverData.navbars.length > 0) {
                dispatch(setNavbars(serverData.navbars));
            }
            if (serverData.sectionNews && serverData.sectionNews.length > 0) {
                dispatch(setSectionNews(serverData.sectionNews));
            }
            if (serverData.youtubeUrl) {
                dispatch(setShortsUrl(serverData.youtubeUrl));
            }
            if (serverData.newsData && Object.keys(serverData.newsData).length > 0) {
                dispatch(setBulkNewsData(serverData.newsData));
            }
        } else {
            dispatch(fetchCustomAds());
        }
    }, [dispatch, serverData]);

    return (
        <>
            <div className="sr-only">
                <h1>Latest Technology News - CXO TV Today & Tech Updates</h1>
                <h2>Latest Technology News & Trends</h2>
            </div>
            <div className="flex flex-col gap-3 mx-auto w-full">
                <div className="mx-auto lg:w-[50%] w-[90%]">
                    <Ad name="tech-summit-2023" priority={true} />
                </div>

                <div className="py-2">
                    <HomeSlider category="Trending News" names={sliderLeft} />
                </div>
                <div>
                    <Section names={names} />
                </div>

                <div className="w-full py-10 px-4 mx-auto items-center bg-[#F3F2F6]">
                    <TwoCategoryData
                        active={true}
                        categoriesWithHeadings={categoriesWithHeadings1}
                    />
                </div>

                <NewsSection categoryData={categoryData} />

                <div className="mx-auto lg:w-[50%] w-[90%]">
                    <Ad name="Data-cloud" />
                </div>

                <div className="w-full py-10 px-5 mx-auto items-center bg-[#F3F2F6]">
                    <TwoCategoryData categoriesWithHeadings={categoriesWithHeadings2} />
                </div>
                <div className="mx-auto lg:w-[50%] w-full">
                    <Ad name="Data-cloud" />
                </div>
            </div>
        </>
    );
};

export default HomePage;
