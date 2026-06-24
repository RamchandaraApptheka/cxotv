"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchLatestNewsByNames } from "../../../redux/slices/sectionSlice";
import dynamic from "next/dynamic";
import { fetchShortsUrl } from "../../../redux/slices/youtubeSlice";
import Link from "next/link";
import Image from "next/image";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const YoutubeIcon = () => (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

const Section = ({ names }) => {
    const dispatch = useDispatch();
    const { sectionNews, status, error } = useSelector(
        (state) => state.SectionNews
    );
    const { url: youtubeUrl, status: youtubeStatus } = useSelector(
        (state) => state.youtube
    );
    const [googleLoaded, setGoogleLoaded] = useState(false);

    const filteredNames = [
        "Tech Priorities",
        "Tech Thursday",
        "Interviews",
        "CFO Playbook",
        "Developers",
        "Cyberwatch",
    ];
    const filteredSectionNews = sectionNews.filter((news) =>
        filteredNames.includes(news.name)
    );

    // Lazy-load Google platform script only when component is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !googleLoaded) {
                    const script = document.createElement("script");
                    script.src = "https://apis.google.com/js/platform.js";
                    script.async = true;
                    script.onload = () => setGoogleLoaded(true);
                    document.body.appendChild(script);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );

        const el = document.querySelector(".g-ytsubscribe");
        if (el) observer.observe(el);

        return () => observer.disconnect();
    }, [googleLoaded]);

    useEffect(() => {
        if (!sectionNews || sectionNews.length === 0) {
            dispatch(fetchLatestNewsByNames(names));
        }
    }, [dispatch, names, sectionNews]);

    useEffect(() => {
        if (!youtubeUrl) {
            dispatch(fetchShortsUrl());
        }
    }, [dispatch, youtubeUrl]);

    if (status === "failed") {
        return <div>Error: {error}</div>;
    }

    const maxCharacters = 100;
    const renderSkeleton = () => (
        <div className="font-fira w-full flex flex-col justify-between">
            <Skeleton height={200} />
            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="60%" />
        </div>
    );

    const renderNewsItem = (item, index, nameIndex) => {
        if (item.news) {
            const truncatedTitle =
                item.news.attributes.title.length > maxCharacters
                    ? `${item.news.attributes.title.substring(0, maxCharacters)}...`
                    : item.news.attributes.title;

            return (
                <div key={index} className="sansfont-tech font-semibold w-full flex flex-col justify-between">
                    <p className="text-sm font-semibold text-center mb-2">
                        {names[nameIndex]}
                    </p>
                    <Link
                        href={`/${names[nameIndex].replace(/\s+/g, "-").toLowerCase()}/${item.news.attributes.slug}`}
                    >
                        <div className="relative border-8 border-slate-100 shadow-md">
                            <div className="relative w-full lg:h-44 h-36 overflow-hidden">
                                <Image
                                    src={
                                        resolveImageUrl(
                                            item.news.attributes.image?.data?.attributes?.formats?.small?.url ||
                                            item.news.attributes.image?.data?.attributes?.url
                                        )
                                    }
                                    alt={item.news.attributes.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0  text-sm bg-black opacity-70 text-white text-center px-2">
                                <div className="py-2 text-[13px]">{truncatedTitle}</div>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full mx-auto flex flex-col md:flex-row gap-4 px-4">
            {/* Main Container for Grid (First 4 Cards) */}
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {status === "loading"
                    ? Array(4)
                        .fill()
                        .map((_, index) => <div key={index}>{renderSkeleton()}</div>)
                    : filteredSectionNews
                        .slice(0, 4)
                        .map((item, index) => renderNewsItem(item, index, index))}
            </div>

            {/* React Player and More Innovation Shorts */}
            <div className="w-full md:w-1/3 flex flex-col gap-3 p-4">
                {youtubeStatus === "loading" ? (
                    <Skeleton height={200} />
                ) : (
                    youtubeUrl && (
                        <div className="relative w-full h-64 md:h-full rounded-lg overflow-hidden">
                            <ReactPlayer
                                url={youtubeUrl}
                                controls
                                width="100%"
                                height="100%"
                                className="absolute top-0 left-0"
                                style={{ borderRadius: "15px" }}
                            />
                        </div>
                    )
                )}

                {/* See More Innovation Shorts Button */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex flex-col items-center">
                        <div
                            className="g-ytsubscribe"
                            data-channelid="UCNSQbKNLmJBhCBCIR0ZqqPA"
                            data-layout="default"
                            data-theme="dark"
                            data-count="default"
                        ></div>
                        <span className="text-xs mt-1 text-gray-500 dark:text-gray-300">
                            Subscribe to our channel for the latest updates
                        </span>
                    </div>

                    <Link
                        href="/Innovation"
                        className="w-full px-2 py-2 text-center bg-red-500 text-white font-fira rounded-lg hover:bg-red-600 transition duration-300 text-sm flex items-center justify-center"
                    >
                        <YoutubeIcon />
                        <span className="text-center">See More Innovation Shorts</span>
                    </Link>
                </div>
            </div>

            {/* Right Side Container for Last 2 Cards */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                {status === "loading"
                    ? Array(2)
                        .fill()
                        .map((_, index) => <div key={index}>{renderSkeleton()}</div>)
                    : filteredSectionNews
                        .slice(4, 6)
                        .map((item, index) => renderNewsItem(item, index, index + 4))}
            </div>
        </div>
    );
};

export default Section;
