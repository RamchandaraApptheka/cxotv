"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import timeAgo from "../../../utils/dateConverter";
import { BACKEND_URL } from '@/utils/env';
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

// Utility to convert names to API-friendly and SEO-friendly formats
const toApiFormat = (raw) => {
    return raw
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
};

const toSeoFriendly = (text) => {
    if (!text) return "";
    return text
        .toLowerCase()
        .replace(/[^\w\s -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
};

export default function CustomCategoryData({ categoryName: propCategory }) {
    const params = useParams();
    const rawName = propCategory || params.categoryName;
    const formattedName = toApiFormat(rawName);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchPage = async (page = 1) => {
            setLoading(true);
            try {
                // Fixed: Removed .data from filter syntax
                const res = await fetch(
                    `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=${encodeURIComponent(formattedName)}&filters[$or][1][subcategories][name][$eq]=${encodeURIComponent(formattedName)}&pagination[page]=${page}`
                );
                const json = await res.json();
                setItems(json.data || []);
                setTotalPages(json.meta?.pagination?.pageCount || 1);
            } catch (err) {
                console.error("Error loading category data:", err);
                setItems([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        document.title = formattedName;
        fetchPage(currentPage);
    }, [formattedName, currentPage]);

    const handlePageClick = (num) => {
        if (num >= 1 && num <= totalPages && num !== currentPage) {
            setCurrentPage(num);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    disabled={i === currentPage}
                    className={
                        `mx-1 px-3 py-1 rounded-full ${i === currentPage ? 'bg-purple-600 text-white' : 'hover:bg-gray-200'}
        `}
                    aria-current={i === currentPage ? 'page' : undefined}
                >
                    {i}
                </button>
            );
        }
        return <div className="flex justify-center py-6">{pages}</div>;
    };

    if (loading && items.length === 0) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((entry) => {
                    const attr = entry.attributes;
                    const slug = toSeoFriendly(attr.slug || attr.title);
                    const imageUrl = attr.image?.data?.attributes?.formats?.small?.url
                        ? resolveImageUrl(attr.image.data.attributes.formats.small.url)
                        : attr.image?.data?.attributes?.url
                        ? resolveImageUrl(attr.image.data.attributes.url)
                        : '';
                    return (
                        <Link key={entry.id} href={`/${rawName}/${slug}`}>
                            <div className="bg-white shadow-md rounded-md overflow-hidden">
                                <div className="relative w-full h-48">
                                    {imageUrl ? (
                                        <Image src={imageUrl} alt={attr.title}  width={300}
                                        height={400} className="object-cover" />
                                    ) : (
                                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                                            <span className="text-gray-400">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">{attr.title}</h3>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{attr.authName || 'Staff Writer'}</span>
                                        <span>{timeAgo(attr.Date || attr.publishedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })
                }
            </div >
            {renderPagination()}
        </>
    );
}

