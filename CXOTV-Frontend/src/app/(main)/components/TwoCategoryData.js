'use client'

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchNewsByName } from "../../../redux/slices/newsSlice";
import Link from 'next/link';
import Image from "next/image";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const TwoCategoryData = ({ categoriesWithHeadings, active }) => {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useSelector((state) => state.news);

    useEffect(() => {
        // Fetch news data for each category/subcategory if not already in store
        categoriesWithHeadings.forEach(categoryItem => {
            const categoryName = categoryItem.name;
            if (!data[categoryName] || data[categoryName].length === 0) {
                dispatch(fetchNewsByName({ nameParam: categoryName }));
            }
        });
    }, [dispatch, categoriesWithHeadings, data]);

    const renderColumnSkeleton = (name) => (
        <div key={name} className="lg:flex flex-col gap-2 w-full">
            <div className="text-[28px] sansfont-tech font-semibold uppercase">
                <Skeleton width={200} height={30} />
            </div>
            <div className="h-1 w-20 bg-[#4601FA]"></div>
            <div className="lg:flex gap-5 py-6 w-full">
                <Skeleton width="100%" height={200} className="rounded-md pr-2 w-full h-full lg:h-44 h-48" style={{ borderRadius: '5%' }} />
                <div className="lg:flex flex-col gap-1 w-full text-ellipsis overflow-hidden pl-4">
                    <Skeleton height={20} count={3} />
                </div>
            </div>
            <div className="flex items-end justify-end">
                <Skeleton width={100} height={30} />
            </div>
        </div>
    );

    return (
        <div className="lg:flex gap-5 lg:px-5 md:px-5 px-0 w-full">
            {categoriesWithHeadings.map(({ name, heading }) => {
                const categoryData = data[name];
                if (categoryData === undefined) {
                    if (isError) {
                        return <div key={name} className="lg:flex flex-col gap-2 w-full text-red-500">Error loading {heading}</div>;
                    }
                    return renderColumnSkeleton(name);
                }

                if (categoryData.length === 0) return null;

                const firstItem = categoryData[0];

                const categoryLink =
                    firstItem.category && firstItem.category.categoryName
                        ? `/${firstItem.category.categoryName.replace(/\s+/g, "-").toLowerCase()}/${firstItem.attributes.title}`
                        : `/${name.replace(/\s+/g, "-").toLowerCase()}/${firstItem.attributes.slug}`;

                const categoryLinkSeeMore =
                    firstItem.category && firstItem.category.categoryName
                        ? `/${firstItem.category.categoryName.replace(/\s+/g, "-").toLowerCase()}`
                        : `/${name.replace(/\s+/g, "-").toLowerCase()}`;

                return (
                    <div key={name} className="lg:flex flex-col gap-2 w-full">
                        <div className="text-[28px] sansfont-tech font-semibold uppercase">{heading}</div>
                        <div className="h-1 w-20 bg-[#4601FA]"></div>
                        <div className="lg:flex gap-5 py-6 w-full">
                            <div className="lg:w-[100%] relative flex">
                                <Link href={categoryLink} className="relative block flex-shrink-0 lg:w-[45%]">
                                    <div className="relative w-full lg:h-44 h-48 overflow-hidden">
                                        <Image
                                            src={
                                                resolveImageUrl(
                                                    firstItem.attributes.image?.data?.attributes?.formats?.medium?.url ||
                                                    firstItem.attributes.image?.data?.attributes?.url
                                                )
                                            }
                                            alt={firstItem.attributes.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover rounded-md pr-2"
                                            style={{ borderRadius: '5%' }}
                                        />
                                    </div>
                                </Link>
                                
                                <div className="lg:flex flex-col gap-1 w-full text-ellipsis overflow-hidden pl-4">
                                    {!active && (
                                        <div className="flex flex-wrap items-center gap-2 lg:py-0 py-6 font-fira">
                                            {firstItem.attributes.categories?.data?.map(category => (
                                                <div key={category.id} className="font-semibold font-fira text-[12px] capitalize">
                                                    <div className="text-white bg-[#5C39F2] hover:bg-[#2B0F4A] py-1 font-noto transition-all duration-200 font-normal px-4 rounded-md">
                                                        <Link href={`/${category.attributes.name.split(" ").join("-").toLowerCase()}`} className="font-medium text-[13px] capitalize">
                                                            {category.attributes.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                            {firstItem.attributes.subcategories?.data?.map(subcategory => (
                                                <div key={subcategory.id} className="font-semibold font-fira text-[12px] capitalize">
                                                    <div className="text-white bg-[#5C39F2] hover:bg-[#2B0F4A] py-1 font-noto transition-all duration-200 font-normal px-4 rounded-md">
                                                        <Link href={`/${subcategory.attributes.name.split(" ").join("-").toLowerCase()}`} className="font-medium text-[13px] capitalize">
                                                            {subcategory.attributes.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <Link href={categoryLink}>
                                        <p className="sansfont-tech text-lg lg:pt-0 pt-2 font-semibold text-[16px] text-[#4601FA] hover:text-black transition-all duration-200">
                                           {firstItem.attributes.title}
                                        </p>
                                    </Link>
                                    {active && <div className=""></div>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end justify-end">
                            <a href={categoryLinkSeeMore} className="sansfont-tech border border-blue-800 lg:px-6 px-3 py-1 text-blue-800 font-bold">
                                See More
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TwoCategoryData;