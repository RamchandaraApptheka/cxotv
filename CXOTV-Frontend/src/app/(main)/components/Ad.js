"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const Ad = memo(({ name, priority = false }) => {
    const { AdData } = useSelector((state) => state.customAds);

    if (!AdData || !Array.isArray(AdData) || AdData.length === 0) {
        return (
            <div className="w-full aspect-[8/1] bg-[#F3F2F6] animate-pulse rounded-md" />
        );
    }

    const adItem = AdData.find((item) => item?.attributes?.name === name);

    if (!adItem) {
        return <div className="w-full aspect-[8/1]" />;
    }

    const imageData = adItem.attributes?.image?.data?.attributes;

    if (!imageData) {
        return <div className="w-full aspect-[8/1]" />;
    }

    const imageUrl = resolveImageUrl(
        imageData.formats?.medium?.url || imageData.url
    );

    return (
        <div className="relative w-full">
            <Link
                href={adItem.attributes.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="relative w-full aspect-[8/1]">
                    <Image
                        src={imageUrl}
                        alt={adItem.attributes.name || "Advertisement"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain"
                        priority={priority}
                    />
                </div>
            </Link>
        </div>
    );
});

Ad.displayName = 'Ad';

export default Ad;
