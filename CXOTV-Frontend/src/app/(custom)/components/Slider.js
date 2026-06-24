'use client';

import { useState, useEffect } from "react";
import LoadingSpinner from "../../(main)/components/LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import { fetchNewsByName } from "../../../redux/slices/newsSlice";
import { fetchLatestNews } from "../../../redux/slices/latestNews";
import { fetchShortsUrl } from "../../../redux/slices/youtubeSlice";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import ReactPlayer from "react-player";
import { SiYoutubeshorts } from "react-icons/si";
import { BACKEND_URL } from '@/utils/env';

const Slider = ({ category, names }) => {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useSelector((state) => state.news);
    const { data: latestNewsData } = useSelector((state) => state.latestNews);
    const { url: youtubeUrl, isLoading: isYoutubeLoading } = useSelector(
        (state) => state.youtube
    );
    const [itemsToDisplay, setItemsToDisplay] = useState([]);

    useEffect(() => {
        dispatch(fetchLatestNews());
    }, [dispatch]);

    useEffect(() => {
        if (category) {
            dispatch(fetchNewsByName({ nameParam: category }));
        }
    }, [dispatch, category]);

    useEffect(() => {
        if (names && names.length > 0) {
            names.forEach((name) => {
                dispatch(fetchNewsByName({ nameParam: name }));
            });
        }
    }, [dispatch, names]);

    useEffect(() => {
        if (names && names.length > 0) {
            const combinedData = names.reduce((accumulator, name) => {
                if (data[name] && data[name].length > 0) {
                    accumulator.push(data[name][0]);
                }
                return accumulator;
            }, []);
            setItemsToDisplay(combinedData.slice(0, 4));
        }
    }, [data, names]);

    useEffect(() => {
        dispatch(fetchShortsUrl());
    }, [dispatch]);

    if (isLoading || isYoutubeLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <div>Error fetching news data.</div>;
    }

    const categoryData = data[category];

    if (!categoryData || categoryData.length === 0) {
        return <LoadingSpinner />;
    }

    const firstFourItems = categoryData.slice(0, 5);
    const baseUrl = BACKEND_URL;

    return (
        <div className="lg:flex lg:gap-2 px-4 mx-auto w-full py-3 font-fira">
            {/* section 1 */}.

            <div className="lg:w-[55%] w-full">
                <Link
                    href={`/${category.split(" ").join("-")}/${firstFourItems[0].attributes.slug
                        }`}
                    className="lg:flex flex-col"
                >
                    <Swiper
                        spaceBetween={0}
                        centeredSlides={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        navigation={true}
                        modules={[Autoplay, Navigation]}
                        className="mySwiper relative z-0"
                    >
                        {firstFourItems.map((ele) => (
                            <SwiperSlide key={ele.id}>
                                <div className="relative w-full lg:h-[400px] h-54 border-8 border-slate-100">
                                    <Link
                                        href={`/${category.split(" ").join("-")}/${ele.attributes.slug
                                            }`}
                                    >
                                        <Image
                                            src={
                                                ele.attributes.image.data.attributes.formats?.medium
                                                    ?.url
                                                    ? baseUrl +
                                                    ele.attributes.image.data.attributes.formats.medium.url
                                                    : baseUrl +
                                                    ele.attributes.image.data.attributes.url
                                            }
                                            alt={ele.attributes.image.data.attributes.url}
                                            fill
                                            style={{objectFit: 'cover'}}
                                            className="object-cover h-full w-full"
                                            priority
                                        />
                                    </Link>
                                    <div className="absolute bottom-0 left-0 right-0 lg:text-[20px] text-sm bg-black opacity-70 text-white text-center p-2">
                                        {ele.attributes.title.length > 130
                                            ? `${ele.attributes.title.substring(0, 130)}...`
                                            : ele.attributes.title}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Link>
            </div>
            <div className="lg:w-[45%] w-full flex flex-col flex-wrap">
                <div className="lg:flex lg:flex-col lg:gap-4 gap-2">
                    {itemsToDisplay.slice(2, 4).map((item, index) => {
                        const maxCharacters = 70;
                        const truncatedTitle =
                            item.attributes.title.length > maxCharacters
                                ? `${item.attributes.title.substring(0, maxCharacters)}...`
                                : item.attributes.title;

                        return (
                            <Link
                                href={`/${item.attributes.subcategories &&
                                    item.attributes.subcategories.data.length > 0
                                    ? `${item.attributes.subcategories.data[0].attributes.name
                                        .split(" ")
                                        .join("-")}/${item.attributes.slug}`
                                    : item.attributes.categories &&
                                        item.attributes.categories.data.length > 0
                                        ? `${item.attributes.categories.data[0].attributes.name
                                            .split(" ")
                                            .join("-")}/${item.attributes.slug}`
                                        : ""
                                    }`}
                                key={index}
                                className="lg:flex lg:flex-col lg:w-full relative border-8 gap-4 border-slate-100"
                            >
                                <Image
                                    src={
                                        item.attributes.image.data.attributes.formats?.small?.url
                                            ? baseUrl +
                                            item.attributes.image.data.attributes.formats.small.url
                                            : baseUrl +
                                            item.attributes.image.data.attributes.url
                                    }
                                    alt={item.attributes.title}
                                    width={400}
                                    height={176}
                                    style={{objectFit: 'cover'}}
                                    className="object-cover lg:h-44 h-36 w-full"
                                    priority
                                />
                                <div className="lg:absolute bottom-0 left-0 right-0 bg-black opacity-70 text-white text-center">
                                    <div className="py-2 text-[13px]">{truncatedTitle}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ReactPlayer for YouTube Shorts Video */}
            <div className="lg:w-[45%] w-full flex flex-col justify-center items-center lg:pr-2  border-slate-100 pr-0">
                {youtubeUrl && (
                    <div className="w-full h-full">
                        <ReactPlayer url={youtubeUrl} controls width="100%" height="100%" />
                    </div>
                )}
                <div className="rounded-md overflow-hidden flex items-center justify-center">
                    <Link
                        href="/Innovation"
                        className="flex items-center justify-center w-full px-4 py-2 mt-2 text-center bg-red-500 text-white font-fira rounded-md hover:bg-red-600 transition duration-300"
                    >
                        <SiYoutubeshorts className="mr-2" />
                        See More Innovation Shorts
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Slider;