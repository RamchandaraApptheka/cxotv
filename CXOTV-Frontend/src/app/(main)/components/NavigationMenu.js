"use client"

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import imageHome from "../../../../public/home_icon.png";


const NavigationMenu = ({ category, subcategories }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const HamburgerIcon = () => <FaBars size={16} />;
    const CloseIcon = () => <FaTimes size={16} />;

    const [accordionState, setAccordionState] = useState({});

    const toggleAccordion = (categoryName) => {
        setAccordionState((prevState) => ({
            ...prevState,
            [categoryName]: !prevState[categoryName],
        }));
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const hasExclusiveSubcategories =
        subcategories &&
        subcategories.data.some(
            (subcategory) =>
                subcategory.attributes?.name === "Thought Leadership"
        );

    const formatUrlForSEO = (name) => {
        return name.replace(/\s+/g, "-").toLowerCase();
    };

    return (
        <div className="w-screen">
            {/* MOBILE MENU - always in DOM, hidden via CSS */}
            <div className="nav-menu-mobile text-black font-medium uppercase font-fira text-[16px] w-full">
                <div className="flex justify-center items-center py-2">
                    <button onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? (
                            <div className="flex gap-2 items-center">
                                Menu <CloseIcon />
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                Menu <HamburgerIcon />
                            </div>
                        )}
                    </button>
                </div>
                {mobileMenuOpen && (
                    <div className="w-full text-black font-medium uppercase font-fira text-[16px]">
                        {category && subcategories && (
                            <ul className="flex flex-col mt-5 mb-5 mx-auto w-[90%]">
                                <Link href="/">Home</Link>
                                {subcategories.data
                                    .filter(
                                        (subcategory) =>
                                            subcategory.attributes?.name !== "Thought Leadership" &&
                                            subcategory.attributes?.name !== "BFSI VIDEOS" &&
                                            subcategory.attributes?.name !== "Education budget" &&
                                            subcategory.attributes?.name !== "Education Feature" &&
                                            subcategory.attributes?.name !== "Education Guest Speak" &&
                                            subcategory.attributes?.name !== "Education Interview" &&
                                            subcategory.attributes?.name !== "m learning" &&
                                            subcategory.attributes?.name !== "Education Policy" &&
                                            subcategory.attributes?.name !== "Skill Development" &&
                                            subcategory.attributes?.name !== "VIDEOS" &&
                                            subcategory.attributes?.name !==
                                            "Steam career education"
                                    )
                                    .map((subcategory) => (
                                        <li key={subcategory.id} className="py-2">
                                            <Link
                                                href={`/${formatUrlForSEO(subcategory.attributes?.name)}`}
                                            >
                                                {subcategory.attributes?.name}
                                            </Link>
                                        </li>
                                    ))}
                                {hasExclusiveSubcategories && (
                                    <li
                                        className="py-2"
                                        onMouseEnter={() => setShowDropdown(true)}
                                        onMouseLeave={() => setShowDropdown(false)}
                                    >
                                        <span
                                            onClick={() => toggleAccordion("Exclusive")}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p>Exclusive</p>
                                                <IoIosArrowDown />
                                            </div>
                                        </span>
                                        {showDropdown && accordionState["Exclusive"] && (
                                            <ul className="flex-col mt-5 mb-5 mx-auto w-[90%]">
                                                <li>
                                                    <Link href="/cxo-talk">CXO Talk</Link>
                                                </li>
                                                <li>
                                                    <Link href="/thought-leadership">Thought Leadership</Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* DESKTOP MENU - always in DOM, hidden via CSS */}
            <div className="nav-menu-desktop w-full text-black font-medium uppercase cursor-pointer font-fira text-[15px]">
                {category && subcategories && (
                    <ul className="flex flex-wrap items-center justify-center gap-8 mt-5 mb-5 mx-auto w-[90%]">
                        <li className="flex items-center">
                            <Link href="/">
                                <Image
                                    src={imageHome}
                                    alt="Home"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer"
                                />
                            </Link>
                        </li>
                        <Link href={category}>Home</Link>

                        {subcategories.data
                            .filter(
                                (subcategory) =>
                                    subcategory.attributes?.name !== "Thought Leadership" &&
                                    subcategory.attributes?.name !== "BFSI VIDEOS" &&
                                    subcategory.attributes?.name !== "Education budget" &&
                                    subcategory.attributes?.name !== "Education Feature" &&
                                    subcategory.attributes?.name !== "Education Guest Speak" &&
                                    subcategory.attributes?.name !== "Education Interview" &&
                                    subcategory.attributes?.name !== "m learning" &&
                                    subcategory.attributes?.name !== "Education Policy Matter" &&
                                    subcategory.attributes?.name !== "Skill Development" &&
                                    subcategory.attributes?.name !== "VIDEOS" &&
                                    subcategory.attributes?.name !== "Steam career education"
                            )
                            .map((subcategory) => (
                                <li key={subcategory.id}>
                                    <Link
                                        href={`/${formatUrlForSEO(subcategory.attributes?.name)}`}
                                    >
                                        {subcategory.attributes?.name}
                                    </Link>
                                </li>
                            ))}
                        {hasExclusiveSubcategories && (
                            <li
                                className="py-2 relative"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                            >
                                <span
                                    onClick={() => toggleAccordion("Exclusive")}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center lg:gap-2 gap:0">
                                        <p>Exclusive</p>
                                        <IoIosArrowDown />
                                    </div>
                                </span>
                                {showDropdown && (
                                    <ul className="absolute left-0 mt-2 bg-white shadow-lg z-30 px-2 w-44">
                                        <li className="py-4">
                                            <Link href="/thought-leadership">Thought Leadership</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NavigationMenu;
