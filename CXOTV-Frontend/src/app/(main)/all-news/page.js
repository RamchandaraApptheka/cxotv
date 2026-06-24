'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Ad from "../components/Ad";
import { fetchRegionNews } from "../../../redux/slices/regionNewsSlice";
import Link from "next/link";
import timeAgo from "../../../utils/dateConverter";
import Image from "next/image";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const RegionNews = ({ title, category, data, handleSeeMore }) => {
    return (
        <div className="w-full py-10 px-4 mx-auto items-center bg-[rgb(243,242,246)]">
            <div className="sansfont-tech flex flex-col gap-2 text-[28px] font-semibold mb-4 px-5 lg:px-10">
                <p>{`Latest ${category === "Trending News" ? "Trending" : category
                    } News`}</p>
                <div className="h-1 w-20 bg-[#4601FA]"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:px-10 px-5">
                {data[category]?.slice(0, 8).map((item, index) => {
                    const slug = item.attributes.slug || "";
                    const title = item.attributes.title || "No title";
                    const date = item.attributes.Date || item.attributes.publishedAt || "";
                    const imageUrl = item.attributes.image?.data?.attributes?.url || "";
                    const heading = item.attributes.heading || "";

                    return (
                        <div key={index} className="w-full mb-4">
                            <Link href={`/${category.replace(/\s+/g, "-")}/${slug}`}>
                                <Image
                                    src={resolveImageUrl(imageUrl)}
                                    alt={title}
                                    width={400}
                                    height={300}
                                    className="object-cover w-full h-48"
                                    loading="lazy"
                                />
                            

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
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handleSeeMore(category)}
                    className="py-2 px-4 bg-[#4601FA] text-white font-semibold rounded"
                >
                    See More News
                </button>
            </div>
        </div>
    );
};

const FourRegionsNews = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { data, isLoading, isError } = useSelector((state) => state.regionNews);

    useEffect(() => {
        dispatch(fetchRegionNews("APAC"));
        dispatch(fetchRegionNews("EMEA"));
        dispatch(fetchRegionNews("INDIA"));
        dispatch(fetchRegionNews("USA"));
        dispatch(fetchRegionNews("Trending News"));
    }, [dispatch]);

    const handleSeeMore = (category) => {
        router.push(`/${category.replace(/\s+/g, "-")}`);
    };

    if (isLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (isError) {
        return <div>Error loading data.</div>;
    }

    return (
        <div className="flex flex-col gap-3 mx-auto w-full">

            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="tech-summit-2023" />
            </div>

            <RegionNews
                category="APAC"
                data={data}
                handleSeeMore={handleSeeMore}
            />

            <RegionNews
                category="EMEA"
                data={data}
                handleSeeMore={handleSeeMore}
            />

            <RegionNews
                category="INDIA"
                data={data}
                handleSeeMore={handleSeeMore}
            />

            <RegionNews
                category="USA"
                data={data}
                handleSeeMore={handleSeeMore}
            />

            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="Data-cloud" />
            </div>
        </div>
    );
};

export default FourRegionsNews;