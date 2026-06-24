"use client"

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { IoIosSearch } from "react-icons/io";
import {
    FaFacebookF,
    FaLinkedin,
    FaYoutube,
    FaClock,
    FaUser,
    FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
    setSearchTerm,
    fetchSearchResults,
} from "@/redux/slices/searchSlice";
import timeAgo from "@/utils/dateConverter";
import SocialMediaPopup from "./SocialMediaPopup";
import { FiChevronDown } from "react-icons/fi";
import Image from "next/image";

const HeaderAdjust = ({ logo, homePath = "/" }) => {
    const [selectedOption, setSelectedOption] = useState("option0");
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter(); // Use useRouter from next/navigation
    const searchResults = useSelector((state) => state.search.searchResults);

    const handleInputChange = async (e) => {
        setInputValue(e.target.value);
        if (e.target.value.length > 2) {
            // Fetch related news articles
            await dispatch(fetchSearchResults(e.target.value));
            setSuggestions(searchResults.slice(0, 3));
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchTerm = inputValue.trim().toLowerCase();
        dispatch(setSearchTerm(searchTerm)); // Dispatch setSearchTerm action with inputValue
        await dispatch(fetchSearchResults(searchTerm));
        router.push("/news-search"); // Use router.push for navigation
    };

    const options = [
        { value: "option1", label: "APAC" },
        { value: "option2", label: "EMEA" },
        { value: "option3", label: "USA" },
        { value: "option4", label: "INDIA" },
    ];

    const handleOptionChange = (option) => {
        setSelectedOption(option.value);
        setIsOpen(false);
        // Add your navigation logic here
        if (option.value === "option1") {
            router.push("/apac");
        } else if (option.value === "option2") {
            router.push("/emea");
        } else if (option.value === "option3") {
            router.push("/usa");
        } else if (option.value === "option4") {
            router.push("/india");
        }
    };

    // const handleSuggestionClick = (slug) => {
    //     router.push(`/Trending-News/${slug}`);
    // };

    // Helper function to truncate text
    const truncateText = (text, maxWords) => {
        const words = text.split(" ");
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(" ") + "...";
        }
        return text;
    };

    return (
        <div className="lg:flex py-3 items-center justify-between mx-auto lg:w-[95%] w-full bg-white shadow-lg relative">
            <div className="flex lg:justify-start justify-center cursor-pointer lg:w-[30%]">
                <Link href={homePath || "/"}>
                    <Image
                        src={logo}
                        loading="lazy"
                        alt="logo"
                        style={{ height: 'auto' }}
                        className="lg:w-[250px] max-sm:w-40 w-40"
                    />
                </Link>
            </div>

            <div className="lg:flex items-center justify-evenly gap-8 lg:w-[70%] relative">
                <div className="flex items-center justify-center mt-4 relative">
                    <form onSubmit={handleSearch}>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="border-b-2 pr-10  border-[#EBEBEB] italic py-2 px-3 outline-none font-noto transition-colors lg:w-72 focus:border-blue-500"
                                placeholder="Enter Search Keyword"
                                style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            />
                            <button
                                type="submit"
                                className="absolute right-0 flex text-[#A3A3A3] hover:text-blue-500"
                                style={{ right: "0.5rem" }}
                            >
                                <IoIosSearch size={25} />
                            </button>
                        </div>
                    </form>
                    {suggestions.length > 0 && (
                        <div className="absolute top-full mt-2 bg-white border border-gray-300 w-full shadow-lg rounded-bl rounded-br z-10">
                            <ul>
                                {suggestions.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer font-medium text-[13px]"
                                        onClick={() => handleSuggestionClick(item.attributes.slug)}
                                    >
                                        <div>
                                            <p className="font-fira text-sm capitalize text-[15px] text-gray-800">
                                                {truncateText(item.attributes.title, 10)}
                                            </p>
                                            <div className="flex items-center justify-between text-[12px] text-gray-500 font-normal font-sans">
                                                <div className="flex items-center normal-case">
                                                    <FaUser size={10} className="mr-1" />
                                                    {item.attributes.authName}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock size={10} className="mr-1" />
                                                    {item.attributes.Date
                                                        ? timeAgo(item.attributes.Date)
                                                        : timeAgo(item.attributes.publishedAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="w-full px-4 py-2 text-[15px] font-fira text-center text-gray-600 bg-gray-100 border-t border-gray-300  shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50  rounded-bl rounded-br"
                                onClick={handleSearch}
                            >
                                View All Results
                            </button>
                        </div>
                    )}
                </div>

                <div className="font-sans font-normal flex items-center justify-center gap-2 py-4">
                    <div
                        className="relative inline-block w-32"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        <div className="bg-white border-none text-gray-700 py-2 px-4 pr-10 rounded leading-tight cursor-pointer flex justify-between items-center">
                            <span>
                                {selectedOption === "option0"
                                    ? "APAC"
                                    : options.find((option) => option.value === selectedOption)
                                        ?.label}
                            </span>
                            <FiChevronDown className="w-5 h-5 text-gray-600" />
                        </div>
                        {isOpen && (
                            <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded z-10">
                                {options.map((option) => (
                                    <div
                                        key={option.value}
                                        className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                                        onMouseEnter={() => setIsOpen(true)} // Keep dropdown open on hover
                                        onClick={() => handleOptionChange(option)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <a
                        href="https://www.facebook.com/cxotvnews"
                        className="rounded-full bg-indigo-600 p-2 mr-2 hover:bg-indigo-700"
                    >
                        <FaFacebookF className="text-white" />
                    </a>
                    <a
                        href="https://twitter.com/cxotvnews"
                        className="rounded-full bg-indigo-600 p-2 mr-2 hover:bg-indigo-700"
                    >
                        <FaXTwitter className="text-white" />
                    </a>
                    <a
                        href="https://www.instagram.com/cxotv_news/"
                        className="rounded-full bg-indigo-600 p-2 mr-2 hover:bg-indigo-700"
                    >
                        <FaInstagram className="text-white" />
                    </a>
                    <a
                        href="https://www.youtube.com/channel/UCNSQbKNLmJBhCBCIR0ZqqPA"
                        className="rounded-full bg-indigo-600 p-2 mr-2 hover:bg-indigo-700"
                    >
                        <FaYoutube className="text-white" />
                    </a>
                    <a
                        href="https://www.linkedin.com/company/cxotvnews"
                        className="rounded-full bg-indigo-600 p-2 hover:bg-indigo-700"
                    >
                        <FaLinkedin className="text-white" />
                    </a>
                </div>

                <div>
                    {/* Header content */}
                    <div className="flex justify-center py-2 md:py-4">
                        <button
                            onClick={() => setShowPopup(true)} // Show popup on button click
                            className="p-2 px-4 bg-gradient-to-r from-[#ED4321] to-[#03A1E1] text-white capitalize transition-all duration-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Register
                        </button>
                    </div>

                    {/* Pass showPopup and setShowPopup as props to control the popup */}
                    <SocialMediaPopup showPopup={showPopup} setShowPopup={setShowPopup} />
                </div>
            </div>
        </div>
    );
};

export default HeaderAdjust;