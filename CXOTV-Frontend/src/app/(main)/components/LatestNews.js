'use client';

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestNews } from "../../../redux/slices/latestNews";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import Ad from "./Ad";
import timeAgo from "../../../utils/dateConverter";
import Link from "next/link";
import Image from "next/image";
import VideoAd from "./VideoAd";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const LatestNews = () => {
    const dispatch = useDispatch();
    const {
        data: latestNewsData,
        loading,
        error,
    } = useSelector((state) => state.latestNews);

    useEffect(() => {
        dispatch(fetchCustomAds());
        dispatch(fetchLatestNews());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <div className="spinner2"></div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const itemsToDisplay = latestNewsData?.slice(0, 10) || [];

    return (
        <div className="lg:flex flex-col w-full gap-5 overflow-x-hidden">
            <VideoAd />

            <div className="lg:flex flex-col gap-1">
                {itemsToDisplay.map((item) => {
                    const linkPath = item.attributes.subcategories &&
                        item.attributes.subcategories.data.length > 0
                        ? `/${item.attributes.subcategories.data[0].attributes.name
                            .split(" ")
                            .join("-")}/${item.attributes.slug}`
                        : item.attributes.categories &&
                            item.attributes.categories.data.length > 0
                            ? `/${item.attributes.categories.data[0].attributes.name
                                .split(" ")
                                .join("-")}/${item.attributes.slug}`
                            : "/";

                    const imageUrl = resolveImageUrl(
                        item.attributes.image?.data?.attributes?.formats?.small?.url ||
                        item.attributes.image?.data?.attributes?.url
                    );

                    return (
                        <div className="max-sm:mt-12 lg:mt-0" key={item.id}>
                            <Link
                                href={linkPath}
                                className="lg:flex gap-3 lg:h-28 cursor-pointer"
                            >
                                <div className="relative lg:h-24 h-48 w-full lg:w-[45%]">
                                    <Image
                                        src={imageUrl}
                                        alt={item.attributes.title || "News image"}
                                        width={300}
                                        height={400}
                                        sizes="(max-width: 768px) 100vw, 45vw"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="noto-text lg:flex flex-col gap-1 lg:w-[55%]">
                                    <h2 className="text-[14px] lg:py-0 py-4 leading-5 lg:h-20 overflow-y-hidden font-noto font-normal hover:text-[#7B5FF4] transition-all duration-200 overflow-hidden">
                                        {item.attributes.title}
                                    </h2>
                                    <p className="font-bold text-[13px] text-[#999999]">
                                        {item.attributes.Date
                                            ? timeAgo(item.attributes.Date)
                                            : timeAgo(item.attributes.publishedAt)}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div className="py-10">
                <Ad name="video" />
            </div>
        </div>
    );
};

export default LatestNews;