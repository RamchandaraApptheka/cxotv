import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchNewsByName } from "../../../redux/slices/newsSlice";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import "../globals.css";
import { FiTrendingUp } from "react-icons/fi";
import banner from "../../../../public/assets/k-singhal-sm-banner.jpg"
import Image from "next/image";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';


const HomeSlider = ({ category, names }) => {
    const dispatch = useDispatch();
    const { data, status, isError } = useSelector((state) => state.news);
    const { sectionNews, status: sectionStatus } = useSelector((state) => state.SectionNews);

    const filteredSectionNews = sectionNews.filter((news) =>
        names.includes(news.name)
    );

    useEffect(() => {
        if (category && (!data[category] || data[category].length === 0)) {
            dispatch(fetchNewsByName({ nameParam: category }));
        }
    }, [dispatch, category, data]);

    if (isError) {
        return <div>Error fetching news data.</div>;
    }

    const categoryData = data[category];

    if (!categoryData || categoryData.length === 0) {
        return (
            <div className="lg:flex lg:gap-2 px-4 mx-auto w-full py-3 font-fira mb-10">
                <div className="lg:w-[55%] w-full flex-grow">
                    <Skeleton height={30} width={150} className="mb-2" />
                    <Skeleton height={396} className="w-full" />
                </div>
                <div className="lg:w-[45%] w-full flex-grow">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {Array(4).fill().map((_, i) => (
                            <div key={i} className="relative border-8 border-slate-100 shadow-md">
                                <Skeleton height={160} className="w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const firstFourItems = categoryData.slice(0, 5);
    const maxCharacters = 100;

    return (
        <>
            <div className="lg:flex lg:gap-2 px-4 mx-auto w-full py-3 font-fira mb-10">
                {/* section 1 - Trending Slider */}
                <div className="lg:w-[55%] w-full flex-grow">
                    <p className="font-fira font-bold flex items-center lg:text-1xl mb-2">
                        <FiTrendingUp
                            size={25}
                            className=" mr-2 text-sm font-semibold text-center"
                        />
                        Trending Now
                    </p>
                    <div className="lg:flex flex-col">
                        {status === "loading" ? (
                            <Skeleton height={396} />
                        ) : (
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
                                style={{ height: 'auto' }}
                            >
                                {firstFourItems.map((ele, idx) => (
                                    <SwiperSlide key={ele.id}>
                                        <div className="relative w-full border-8 border-slate-100">
                                            <Link href={`/${category.split(" ").join("-").toLowerCase()}/${ele.attributes.slug}`}>
                                                <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden">
                                                    <Image
                                                        src={
                                                            resolveImageUrl(
                                                                ele.attributes.image?.data?.attributes?.formats?.medium?.url ||
                                                                ele.attributes.image?.data?.attributes?.url
                                                            )
                                                        }
                                                        alt={ele.attributes.title}
                                                        priority={idx === 0}
                                                        fill
                                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </Link>
                                            <div className="absolute bottom-0 left-0 right-0 lg:text-[20px] text-sm bg-black opacity-70 text-white text-center px-2 py-1">
                                                {ele.attributes.title.length > 130
                                                    ? `${ele.attributes.title.substring(0, 130)}...`
                                                    : ele.attributes.title}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>

                {/* section 2 - Grid Cards */}
                <div className="lg:w-[45%] w-full flex-grow">
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {sectionStatus === "loading"
                            ? Array(4).fill().map((_, index) => (
                                <div key={index} className="relative border-8 border-slate-100 shadow-md">
                                    <Skeleton height={160} className="w-full" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black opacity-70 text-white text-center">
                                        <Skeleton width="80%" height={20} className="mx-auto my-2" />
                                    </div>
                                </div>
                            ))
                            : (
                                <>
                                    {filteredSectionNews.map((item, index) => {
                                        if (item.news) {
                                            const truncatedTitle =
                                                item.news.attributes.title.length > maxCharacters
                                                    ? `${item.news.attributes.title.substring(0, maxCharacters)}...`
                                                    : item.news.attributes.title;

                                            return (
                                                <div key={index} className="font-fira w-full flex flex-col justify-between">
                                                    <h6 className="text-sm font-semibold text-center mb-2">{names[index]}</h6>
                                                    <Link href={`/${names[index].replace(/\s+/g, "-").toLowerCase()}/${item.news.attributes.slug}`}>
                                                        <div className="relative border-8 border-slate-100 shadow-md">
                                                            <div className="relative w-full aspect-[4/3] overflow-hidden">
                                                                <Image
                                                                    src={
                                                                        resolveImageUrl(
                                                                            item.news.attributes.image?.data?.attributes?.formats?.small?.url ||
                                                                            item.news.attributes.image?.data?.attributes?.url
                                                                        )
                                                                    }
                                                                    alt={item.news.attributes.title}
                                                                    fill
                                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black opacity-70 text-white text-center px-1">
                                                                <div className="p-2 text-[13px]">{truncatedTitle}</div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}

                                    {/* Hardcoded Card */}
                                    <div className="font-fira w-full flex flex-col justify-between">
                                        <h6 className="text-sm font-semibold text-center mb-2">Talks with Kalpana</h6>
                                        <Link href="/talks-with-kalpana">
                                            <div className="relative border-8 border-slate-100 shadow-md">
                                                <div className="relative w-full aspect-[4/3] overflow-hidden">
                                                    <Image
                                                        src={banner}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                        alt="Hardcoded News"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeSlider;
