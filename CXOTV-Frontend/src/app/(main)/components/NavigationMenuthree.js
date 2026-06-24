"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import imageHome from "../../../../public/home_icon.png";

const NavigationMenuthree = ({ category, subcategories }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [showExclusiveDropdown, setShowExclusiveDropdown] = useState(false);
    const [showHealthDropdown, setShowHealthDropdown] = useState(false);
    const [showInterviewDropdown, setShowInterviewDropdown] = useState(false);

    const HamburgerIcon = () => <FaBars size={16} />;
    const CloseIcon = () => <FaTimes size={16} />;

    const [accordionState, setAccordionState] = useState({});

    const toggleAccordion = (categoryName) =>
        setAccordionState((prevState) => ({
            ...prevState,
            [categoryName]: !prevState[categoryName],
        }));

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const hasExclusiveSubcategories =
        subcategories &&
        subcategories.data?.some(
            (subcategory) => (subcategory.attributes?.name || "").toLowerCase() === "thought leadership"
        );

    const isHealthCategory =
        category?.attributes?.name === "Health Technology" || category === "Health Technology";

    const healthItNames = [
        "health news",
        "features",
        "feature",
        "health business",
        "policy",
        "healthcare it news",
    ];

    const formatUrlForSEO = (name) => {
        return String(name || "").replace(/\s+/g, "-").toLowerCase();
    };

    const isCommonExcluded = (rawName) => {
        if (!rawName) return false;
        const name = rawName.trim().toLowerCase();

        const excludedSet = new Set([
            "thought leadership",
            "bfsi videos",
            "education budget",
            "education feature",
            "education guest speak",
            "education interview",
            "m learning",
            "education policy",
            "education policy matter",
            "skill development",
            "videos",
            "steam career education",
        ]);

        if (excludedSet.has(name)) return true;
        return false;
    };

    const interviewNamesSet = new Set([
        "cxo speak",
        "health webinars",
        "health interviews",
        "health video",
        "health videos",
    ]);

    let healthItNewsSubcategories = [];
    let otherSubcategories = [];

    if (subcategories?.data) {
        subcategories.data.forEach((subcategory) => {
            const rawName = subcategory.attributes?.name;
            if (!rawName) return;
            const name = rawName.trim();
            const nameLower = name.toLowerCase();

            if (isCommonExcluded(name)) return;

            if (interviewNamesSet.has(nameLower)) {
                return;
            }

            if (isHealthCategory && healthItNames.includes(nameLower)) {
                healthItNewsSubcategories.push(subcategory);
            } else {
                otherSubcategories.push(subcategory);
            }
        });
    }

    const interviewItems = [
        { name: "CXO Speak", href: `/${formatUrlForSEO("CXO Speak")}` },
        { name: "Health Video", href: `/${formatUrlForSEO("Health Videos")}` },
        { name: "Health Webinars", href: `/${formatUrlForSEO("Health Webinars")}` },
        { name: "Health Interviews", href: `/${formatUrlForSEO("Health Interviews")}` },
    ];

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
                                <li className="py-2 flex items-center gap-2">
                                    <Link href="/" className="flex items-center gap-2">
                                        <Image
                                            src={imageHome}
                                            alt="Home"
                                            width={24}
                                            height={24}
                                            className="cursor-pointer"
                                        />
                                        <span>Home</span>
                                    </Link>
                                </li>

                                {isHealthCategory && healthItNewsSubcategories.length > 0 && (
                                    <li className="py-2">
                                        <span onClick={() => toggleAccordion("Health IT News")} className="cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <p>Health IT News</p>
                                                <IoIosArrowDown />
                                            </div>
                                        </span>

                                        {accordionState["Health IT News"] && (
                                            <ul className="flex flex-col mt-2 ml-4">
                                                {healthItNewsSubcategories.map((subcategory) => (
                                                    <li key={subcategory.id} className="py-1">
                                                        <Link href={`/${formatUrlForSEO(subcategory.attributes?.name || "")}`}>
                                                            {subcategory.attributes?.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                )}

                                <li className="py-2">
                                    <span onClick={() => toggleAccordion("Interview")} className="cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <p>Interview</p>
                                            <IoIosArrowDown />
                                        </div>
                                    </span>
                                    {accordionState["Interview"] && (
                                        <ul className="flex flex-col mt-2 ml-4">
                                            {interviewItems.map((it) => (
                                                <li key={it.name} className="py-1">
                                                    <Link href={it.href}>{it.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>

                                {otherSubcategories.map((subcategory) => (
                                    <li key={subcategory.id} className="py-2">
                                        <Link href={`/${formatUrlForSEO(subcategory.attributes?.name || "")}`}>
                                            {subcategory.attributes?.name}
                                        </Link>
                                    </li>
                                ))}

                                {hasExclusiveSubcategories && (
                                    <li className="py-2">
                                        <span onClick={() => toggleAccordion("Exclusive")} className="cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <p>Exclusive</p>
                                                <IoIosArrowDown />
                                            </div>
                                        </span>
                                        {accordionState["Exclusive"] && (
                                            <ul className="flex flex-col mt-2 ml-4">
                                                <li className="py-1">
                                                    <Link href="/cxo-talk">CXO Talk</Link>
                                                </li>
                                                <li className="py-1">
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
                    <ul className="flex flex-wrap items-center justify-center gap-8 mt-5 mb-5 mx-auto w-[100%]">
                        <li>
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src={imageHome}
                                    alt="Home"
                                    width={24}
                                    height={24}
                                    className="inline-block mr-2 cursor-pointer"
                                />
                                <span>Home</span>
                            </Link>
                        </li>

                        {isHealthCategory && healthItNewsSubcategories.length > 0 && (
                            <li
                                className="py-2 relative"
                                onMouseEnter={() => setShowHealthDropdown(true)}
                                onMouseLeave={() => setShowHealthDropdown(false)}
                            >
                                <span className="cursor-pointer">
                                    <div className="flex items-center lg:gap-2 gap:0">
                                        <p>Health IT News</p>
                                        <IoIosArrowDown />
                                    </div>
                                </span>
                                {showHealthDropdown && (
                                    <ul className="absolute left-0 mt-2 bg-white shadow-lg z-30 px-2 w-52">
                                        {healthItNewsSubcategories.map((subcategory) => (
                                            <li key={subcategory.id} className="py-2">
                                                <Link href={`/${formatUrlForSEO(subcategory.attributes?.name || "")}`}>
                                                    {subcategory.attributes?.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        )}

                        <li
                            className="py-2 relative"
                            onMouseEnter={() => setShowInterviewDropdown(true)}
                            onMouseLeave={() => setShowInterviewDropdown(false)}
                        >
                            <span className="cursor-pointer">
                                <div className="flex items-center lg:gap-2 gap:0">
                                    <p>Interview</p>
                                    <IoIosArrowDown />
                                </div>
                            </span>
                            {showInterviewDropdown && (
                                <ul className="absolute left-0 mt-2 bg-white shadow-lg z-30 px-2 w-44">
                                    {interviewItems.map((it) => (
                                        <li key={it.name} className="py-2">
                                            <Link href={it.href}>{it.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>

                        {otherSubcategories.map((subcategory) => (
                            <li key={subcategory.id}>
                                <Link href={`/${formatUrlForSEO(subcategory.attributes?.name || "")}`}>
                                    {subcategory.attributes?.name}
                                </Link>
                            </li>
                        ))}

                        {hasExclusiveSubcategories && (
                            <li
                                className="py-2 relative"
                                onMouseEnter={() => setShowExclusiveDropdown(true)}
                                onMouseLeave={() => setShowExclusiveDropdown(false)}
                            >
                                <span className="cursor-pointer">
                                    <div className="flex items-center lg:gap-2 gap:0">
                                        <p>Exclusive</p>
                                        <IoIosArrowDown />
                                    </div>
                                </span>
                                {showExclusiveDropdown && (
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

export default NavigationMenuthree;
