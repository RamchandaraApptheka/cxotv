import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchNewsByName } from "../../../redux/slices/newsSlice";
import Link from 'next/link'
import timeAgo from "../../../utils/dateConverter";
import Ad from "./Ad";
import VideoAd from "./VideoAd.js";
import Image from "next/image";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const NewsSection = ({ categoryData }) => {
    const dispatch = useDispatch();
    const { data, isLoading, isError, errorMessage } = useSelector(
        (state) => state.news
    );
    const { AdData } = useSelector((state) => state.customAds);

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                const fetchPromises = categoryData
                    .filter((categoryItem) => !data[categoryItem.name] || data[categoryItem.name].length === 0)
                    .map((categoryItem) =>
                        dispatch(fetchNewsByName({ nameParam: categoryItem.name }))
                    );
                await Promise.all(fetchPromises);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllNews();
    }, [dispatch, categoryData, data]);

    const renderSectionSkeleton = (categoryName, categoryTitle) => (
        <div className="flex flex-col w-full" key={categoryName}>
            <div className="flex items-center w-full justify-between py-4">
                <div className="sansfont-tech flex flex-col gap-2 text-[28px] font-semibold">
                    <p>{categoryTitle}</p>
                    <div className="h-1 w-20 bg-[#4601FA]"></div>
                </div>
                <Skeleton width={100} height={30} />
            </div>
            <div className="lg:flex gap-6 w-full">
                {Array(4)
                    .fill()
                    .map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center lg:w-full"
                        >
                            <div className="w-full relative border-8 border-slate-100 shadow-md h-48 lg:h-48">
                                <Skeleton height={192} className="w-full h-full" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black opacity-70 text-white text-center">
                                    <Skeleton
                                        width="80%"
                                        height={20}
                                        className="mx-auto my-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    return (
        <div className="lg:flex flex-col gap-4 lg:px-10 px-5 w-full">
            {categoryData.map((categoryItem) => {
                const { name: categoryName, title: categoryTitle } = categoryItem;
                const items = data[categoryName];

                if (items === undefined) {
                    if (isError) {
                        return <div key={categoryName} className="text-red-500 py-4">Error loading {categoryTitle}: {errorMessage}</div>;
                    }
                    return renderSectionSkeleton(categoryName, categoryTitle);
                }

                if (items.length === 0) {
                    return null;
                }

                return (
                    <div className="flex flex-col w-full" key={categoryName}>
                        <div className="flex items-center w-full justify-between py-4">
                            <div className="sansfont-tech flex flex-col gap-2 text-[28px] font-semibold">
                                <p>{categoryTitle}</p>
                                <div className="h-1 w-20 bg-[#4601FA]"></div>
                            </div>
                            <a
                                href={`/${categoryName.replace(/\s+/g, "-").toLowerCase()}`}
                                className="sansfont-tech border border-blue-800 lg:px-6 px-3 py-1 text-blue-800 font-bold"
                            >
                                See More
                            </a>
                        </div>
                        <div className="lg:flex gap-6 w-full">
                            {items.slice(0, 4).map((item, index) => {
                                const isSpecialCategory = [
                                    "Tech Thursday",
                                    "Marketing Mondays",
                                    "BFSI NEWS",
                                    "NBFC",
                                    "Healthcare IT News",
                                    "Feature",
                                    "Education News",
                                    "Skill Development",
                                ].includes(categoryName);

                                const adName =
                                    isSpecialCategory && index === 3
                                        ? getAdNameForCategory(categoryName, AdData)
                                        : null;

                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col items-center lg:w-full"
                                    >
                                        {adName ? (
                                            <AdComponent adName={adName} />
                                        ) : (
                                            <ArticleComponent
                                                item={item}
                                                categoryName={categoryName}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const getAdNameForCategory = (categoryName, AdData) => {
    if (categoryName === "Marketing Mondays") return "Dell2";
    if (
        [
            "BFSI NEWS",
            "NBFC",
            "Healthcare IT News",
            "Feature",
            "Education News",
            "Skill Development",
        ].includes(categoryName)
    )
        return "hpe";
    if (categoryName === "Tech Thursday") return "Dell";
    return null;
};

const AdComponent = ({ adName }) =>
    adName === "Dell" ? (
        <div>
            <VideoAd />
            <div className="w-full bg-[#F3F2F6] rounded-t-md">
                {/* <p className="flex items-center justify-center w-[50%] rounded-tl-md bg-[#6142ec] py-2 text-[13px] font-fira text-white">
          Advertisement
        </p> */}
            </div>

        </div>
    ) : (
        <div className="w-full">
            {/* {console.log("adName ", adName)} */}

            {/* Header */}
            <div className="w-full bg-[#F3F2F6] rounded-t-md">
                <p className="flex items-center justify-center w-full rounded-t-md bg-[#6142ec] py-2 text-[13px] font-fira text-white">
                    Advertisement
                </p>
            </div>

            {/* Ad Content */}
            <div className="w-full bg-[#F3F2F6] rounded-b-md">
                <Ad name={adName} />
            </div>
        </div>

    );

const ArticleComponent = ({ item, categoryName }) => (
    <div className="w-full">
        <Link href={`/${categoryName.replace(/\s+/g, "-").toLowerCase()}/${item.attributes.slug}`}>
            <div className="relative w-full h-48 overflow-hidden">
                <Image
                    src={
                        resolveImageUrl(item.attributes.image?.data?.attributes?.url)
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    alt={item.attributes.title}
                    className="object-cover"
                />
            </div>
        
        <div className="flex flex-col w-full py-4">
            <p className="sansfont-tech text-lg font-semibold text-[16px] text-[#4601FA] hover:text-black transition-all duration-200">
                {item.attributes.title}
            </p>
            <p className="sansfont-tech py-2 font-bold text-[13px] text-[#999999]">
                {item.attributes.Date
                    ? timeAgo(item.attributes.Date)
                    : timeAgo(item.attributes.publishedAt)}
            </p>
            {/* <p className="font-normal text-[14px] text-[#666666]">
        {item.attributes.heading}
      </p> */}
        </div>
        </Link>
    </div>
);

export default NewsSection;