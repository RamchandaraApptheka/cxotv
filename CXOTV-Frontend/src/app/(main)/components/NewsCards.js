'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import timeAgo from "../../../utils/dateConverter";
import { resolveImageUrl } from "../../../utils/resolveImageUrl";
import { BACKEND_URL } from "@/utils/env";

const NewsCards = ({ categoryName, categoryTitle, newsData }) => {
    const [items, setItems] = useState(newsData || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(!newsData || newsData.length === 16);

    const apiUrl = BACKEND_URL;

    useEffect(() => {
        if (!newsData) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await fetch(
                        `${apiUrl}/api/news?populate=*&sort=publishedAt:DESC&filters[categories][name][$eq]=${categoryName}&pagination[page]=1&pagination[pageSize]=16`
                    );
                    const { data } = await response.json();
                    setItems(data);
                    setHasMore(data.length === 16);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                setLoading(false);
            };

            fetchData();
        }
    }, [categoryName, newsData, apiUrl]);

    const loadMore = async () => {
        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await fetch(
                `${apiUrl}/api/news?populate=*&sort=publishedAt:DESC&filters[categories][name][$eq]=${categoryName}&pagination[page]=${nextPage}&pagination[pageSize]=8`
            );
            const { data } = await response.json();

            setItems(prevItems => [...prevItems, ...data]);
            setPage(nextPage);
            setHasMore(data.length === 8);
        } catch (error) {
            console.error("Error fetching more data:", error);
        }
        setLoading(false);
    };

    return (
        <div className="w-full">
            <div className="sansfont-tech flex flex-col gap-2 text-[28px] font-semibold mb-4 px-5 lg:px-10">
                <p>{categoryTitle}</p>
                <div className="h-1 w-20 bg-[#4601FA]"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:px-10 px-5">
                {items.map((item, index) => {
                    const slug = item.attributes.slug || "";
                    const title = item.attributes.title || "No title";
                    const date = item.attributes.Date || item.attributes.publishedAt || "";
                    const imageUrl = item.attributes.image?.data?.attributes?.url || "";
                    const heading = item.attributes.heading || "";

                    return (
                        <div key={index} className="w-full mb-4">
                            <Link href={`/${categoryName.toLowerCase().replace(/\s+/g, "-")}/${slug}`}>
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={resolveImageUrl(
                                            item.attributes.image?.data?.attributes?.formats?.small?.url || imageUrl
                                        )}
                                        alt={title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover"
                                    />
                                </div>
                            

                            <div className="flex flex-col w-full py-4">
                                <p className="sansfont-tech text-lg font-semibold text-[16px] text-[#4601FA] hover:text-black transition-all duration-200">
                                    {title}
                                </p>
                                <p className="sansfont-tech py-2 font-bold text-[13px] text-[#999999]">
                                    {timeAgo(date)}
                                </p>
                                <p className="font-normal text-[14px] text-[#666666]">
                                    {heading}
                                </p>
                            </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
            {hasMore && !newsData && (
                <div className="flex justify-end px-5 lg:px-10 mt-4">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="flex items-center py-2 bg-[#4601FA] text-white font-semibold rounded lg:px-5 px-3"
                    >
                        {loading ? "Loading..." : "Show More News"} <FaChevronDown className="ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewsCards;