'use client';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../redux/slices/categoriesSlice";
import { fetchNavbars } from "../../../redux/slices/navbarSlice";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BACKEND_URL } from '@/utils/env';
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const industryCategories = [
    { name: "IT", url: "https://itvarnews.techplusmedia.com/" },
    { name: "BFSI", url: "/bfsi" },
    { name: "Health", url: "/health-technology" },
    { name: "Education", url: "/education-technology" },
    { name: "Manufacturing", url: "/manufacturing" },
    { name: "Retail & E-commerce", url: "/retail-ecommerce" },
    { name: "Telecommunication", url: "/telecommunication" },
    { name: "Energy & Utility", url: "/energy-utility" },
    { name: "Transportation & Logistics", url: "/transportation-logistics" },
    { name: "Government & Public Sector", url: "/government-public-sector" },
    { name: "Defense & Aviation", url: "/defense-aviation" },
    { name: "Media & Entertainment", url: "/media-entertainment" },
];

const technologyCategories = [
    { name: "Cloud", url: "/cloud-computing" },
    { name: "Datacentre", url: "/data-centre" },
    { name: "AI & ML", url: "/al-ml-amp-rpa" },
    { name: "Cyber Security", url: "/cyber-security" },
    { name: "RPA", url: "/rpa" },
    { name: "AR/VR", url: "/ar-vr" },
    { name: "IoT", url: "/iot" },
    { name: "Mobility", url: "/mobility" },
    { name: "5G", url: "/5g" },
    { name: "Blockchain", url: "/blockchain" },
    { name: "Data", url: "/data" },
    { name: "Edge Computing", url: "/edge-computing" },
    { name: "Quantum Computing", url: "/quantum-computing" },
    { name: "NLP", url: "/npl" },
];

const Navbar = ({ podcasts }) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const navbars = useSelector((state) => state.navbars.navbars);
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedEventCategory, setSelectedEventCategory] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accordionState, setAccordionState] = useState({});
    const [hoveredNavItem, setHoveredNavItem] = useState(null);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper functions
    const toggleAccordion = (categoryName) => {
        setAccordionState((prevState) => ({
            ...prevState,
            [categoryName]: !prevState[categoryName],
        }));
    };

    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(fetchCategories());
        }
        if (!navbars || navbars.length === 0) {
            dispatch(fetchNavbars());
        }
    }, [dispatch, categories, navbars]);

    const handleCategoryHover = (categoryName) => {
        setTimeout(() => {
            setActiveCategory(categoryName);
            setHoveredNavItem(categoryName);
            setSelectedEventCategory(null);
        }, 200);
    };

    const handleCategoryLeave = () => {
        setTimeout(() => {
            setActiveCategory(null);
            setHoveredNavItem(null);
            setSelectedEventCategory(null);
        }, 200);
    };

    const chatSeriesCategory = categories.find(
        (category) => category.attributes.name === "Chat Series"
    );

    const Gallery = navbars.find(
        (item) => item.attributes.name === "Brand Gallery"
    );
    const Awards = navbars.find((item) => item.attributes.name === "Awards");

    const events = [
        {
            name: "Partner Roundtable",
            data: navbars.find(
                (item) => item.attributes.name === "Partner Roundtable"
            ),
        },
        {
            name: "Upcoming Events",
            data: navbars.find((item) => item.attributes.name === "Upcoming Events"),
        },
        {
            name: "Past Events",
            data: navbars.find((item) => item.attributes.name === "Past Events"),
        },
    ];

    const handleEventHover = (eventName) => {
        setTimeout(() => {
            setSelectedEventCategory(eventName);
        }, 200);
    };

    const handleEventLeave = () => {
        setTimeout(() => {
            setSelectedEventCategory(null);
        }, 200);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Define missing components
    const HamburgerIcon = () => <FaBars />;
    const CloseIcon = () => <FaTimes />;

    return (
        <div className="w-screen">
            {/* CLS Fix: Use CSS classes for responsive show/hide instead of JS-based conditional rendering.
               This prevents layout shift during hydration when mounted state toggles. */}
            <div className="navbar-mobile text-black capitalize font-fira text-[15px] font-medium">
                    <div className="flex justify-center items-center py-4">
                        <button onClick={toggleMobileMenu}>
                            {mobileMenuOpen ? (
                                <span className="flex gap-2 items-center">
                                    Menu <CloseIcon />
                                </span>
                            ) : (
                                <span className="flex gap-2 items-center">
                                    Menu <HamburgerIcon />
                                </span>
                            )}
                        </button>
                    </div>
                    {mobileMenuOpen && (
                        <div className="flex-col gap-4">
                            <div className="mt-2 w-full">
                                <ul>
                                    {/* Mobile menu items */}
                                    <li className="border-t-2 border-gray-300 w-full py-1 items-center justify-center">
                                        <Link href="/" className="px-2">
                                            Home
                                        </Link>
                                    </li>

                                    {/* Podcast section */}
                                    <li className="relative border-t-2 border-gray-300 w-full py-1 items-center justify-center">
                                        <div className="flex items-center px-2 justify-between cursor-pointer"
                                            onClick={() => toggleAccordion("chat series")}>
                                            <p>Podcast</p>
                                            <IoIosArrowDown />
                                        </div>
                                        {accordionState["chat series"] && chatSeriesCategory && (
                                            <ul className="flex flex-col">
                                                {/* Podcast links */}
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/talks-with-kalpana">Talks with Kalpana</Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/interviews">Interviews</Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/marketing-mondays">
                                                        Marketing Mondays
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/ceo-talk">CEO Talk</Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/cxo-talk">CXO Talk</Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/cfo-playbook">CFO Playbook</Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/tech-thursday">Tech Thursday</Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100">
                                                    <a
                                                        href="https://itvarnews.techplusmedia.com/"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Tech Disruptors
                                                    </a>
                                                </li>
                                                <li className="font-sans font-semibold px-4 py-2 hover:bg-gray-100">
                                                    <Link href="/tech-priorities">Tech Priorities</Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                    {/* Gallery section */}
                                    {Gallery && (
                                        <li className="relative border-t-2 border-gray-300 w-full py-1 items-center justify-center">
                                            <div className="flex items-center px-2 justify-between cursor-pointer"
                                                onClick={() => toggleAccordion("Brand Gallery")}>
                                                <p className="capitalize">{Gallery.attributes.name}</p>
                                                <IoIosArrowDown />
                                            </div>
                                            {accordionState["Brand Gallery"] && (
                                                <ul className="flex flex-col">
                                                    {Gallery.attributes.list.slice().reverse().map((listItem, index) => (
                                                        <li className="px-4 py-2 hover:bg-gray-100" key={index}>
                                                            <a href={listItem.url} className="flex gap-2">
                                                                <Image
                                                                    src={resolveImageUrl(listItem.image?.data?.attributes?.url)}
                                                                    alt={listItem.title}
                                                                    width={64}
                                                                    height={64}
                                                                    className="object-cover border w-16 h-16"
                                                                />
                                                                <div className="flex flex-col justify-center gap-1">
                                                                    <p className="font-fira font-medium">{listItem.title}</p>
                                                                    <p>{listItem.name}</p>
                                                                </div>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    )}

                                    {/* Industry and Technology sections */}
                                    <li className="relative border-t-2 border-gray-300 w-full py-1 items-center justify-center">
                                        <div
                                            className="flex items-center px-2 justify-between cursor-pointer"
                                            onClick={() => toggleAccordion("Industry")}
                                        >
                                            <p>Industry</p>
                                            <IoIosArrowDown />
                                        </div>
                                        {accordionState["Industry"] && (
                                            <ul className="flex flex-col">
                                                {industryCategories.map((category, index) => (
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100"
                                                        key={index}
                                                    >
                                                        {category.url.startsWith("https") ? (
                                                            <a
                                                                href={category.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <p>{category.name}</p>
                                                            </a>
                                                        ) : (
                                                            <Link href={category.url}>
                                                                <p>{category.name}</p>
                                                            </Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                    <li className="relative border-t-2 border-gray-300 w-full py-1 items-center justify-center">
                                        <div
                                            className="flex items-center px-2 justify-between cursor-pointer"
                                            onClick={() => toggleAccordion("Technology")}
                                        >
                                            <p>Technology</p>
                                            <IoIosArrowDown />
                                        </div>
                                        {accordionState["Technology"] && (
                                            <ul className="flex flex-col">
                                                {technologyCategories.map((category, index) => (
                                                    <li
                                                        className="px-4 py-2 hover:bg-gray-100"
                                                        key={index}
                                                    >
                                                        {category.url.startsWith("https") ? (
                                                            <a
                                                                href={category.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <p>{category.name}</p>
                                                            </a>
                                                        ) : (
                                                            <Link href={category.url}>
                                                                <p>{category.name}</p>
                                                            </Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                    <li className="relative border-t-2 border-gray-300 w-full py-1 items-center justify-center">
                                        <div
                                            className="flex items-center px-2 justify-between cursor-pointer"
                                            onClick={() => toggleAccordion("Events")}
                                        >
                                            <p>Events</p>
                                            <IoIosArrowDown />
                                        </div>
                                        {accordionState["Events"] && (
                                            <ul className="flex flex-col">
                                                {events.map((event, index) => (
                                                    <li
                                                        key={index}
                                                        className={`block relative ${selectedEventCategory === event.name
                                                            ? "active"
                                                            : ""
                                                            }`}
                                                    >
                                                        <div
                                                            className="flex items-center px-2 justify-between gap-1"
                                                            onClick={() => handleEventHover(event.name)}
                                                        >
                                                            <p className="pl-2 py-2">{event.name}</p>
                                                            <IoIosArrowDown />
                                                        </div>
                                                        {selectedEventCategory === event.name && (
                                                            <ul className="flex flex-col px-4">
                                                                {event.data &&
                                                                    event.data.attributes.list
                                                                        .slice()
                                                                        .reverse()
                                                                        .map((listItem, listIndex) => (
                                                                            <li
                                                                                className="px-2 py-2 hover:bg-gray-100"
                                                                                key={listIndex}
                                                                            >
                                                                                <a href={listItem.url}>
                                                                                    {listItem.title}
                                                                                </a>
                                                                            </li>
                                                                        ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

            <div className="navbar-desktop mx-auto w-[85%] flex-row items-center leading-4 justify-around lg:px-4 mt-1 cursor-pointer font-fira text-black uppercase font-medium text-[15px]">
                    <div className="flex-col gap-10 w-full">
                        <ul className="flex w-full flex-wrap items-center justify-around h-10 cursor-pointer capitalize">
                            {/* Desktop navigation items */}
                            <li className="cursor-pointer">
                                <Link href="/">Home</Link>
                            </li>

                            <li className="hover:text-blue-500">
                                <Link href="/all-news">All News</Link>
                            </li>

                            {/* Regional News dropdown */}
                            <li className="block relative"
                                onMouseEnter={() => handleCategoryHover("Regional News")}
                                onMouseLeave={handleCategoryLeave}>
                                <div className="flex items-center gap-1">
                                    <p>Regional News</p>
                                    <IoIosArrowDown />
                                </div>
                                {(activeCategory === "Regional News" || hoveredNavItem === "Regional News") && (
                                    <div className="bg-white shadow-md rounded border border-gray-300 text-sm absolute top-auto left-0 min-w-full w-30 z-30 mt-1">
                                        <ul className="uppercase">
                                            <li className="px-2 py-2 hover:bg-gray-100">
                                                <Link href="/apac">APAC</Link>
                                            </li>
                                            <li className="px-2 py-2 hover:bg-gray-100">
                                                <Link href="/emea">EMEA</Link>
                                            </li>
                                            <li className="px-2 py-2 hover:bg-gray-100">
                                                <Link href="/india">INDIA</Link>
                                            </li>
                                            <li className="px-2 py-2 hover:bg-gray-100">
                                                <Link href="/usa">USA</Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </li>

                            <li
                                className="block relative"
                                onMouseEnter={() => handleCategoryHover("chat series")}
                                onMouseLeave={handleCategoryLeave}
                            >
                                {chatSeriesCategory && (
                                    <div className="flex items-center gap-1">
                                        <p className="capitalize">Podcast</p>
                                        <span>
                                            <IoIosArrowDown />
                                        </span>
                                    </div>
                                )}

                                {(activeCategory === "chat series" ||
                                    hoveredNavItem === "chat series") && (
                                        <div className="bg-white shadow-md rounded border border-gray-300 text-sm absolute top-auto left-0 min-w-full w-56 z-30 mt-1">
                                            <ul>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <Link href="/talks-with-kalpana">
                                                        Talks with Kalpana
                                                    </Link>
                                                </li>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <Link href="/interviews">Interviews</Link>
                                                </li>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <Link href="/marketing-mondays">Marketing Mondays</Link>
                                                </li>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <Link href="/ceo-talk">CEO Talk</Link>
                                                </li>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <Link href="/cxo-talk">CXO Talk</Link>
                                                </li>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <Link href="/cfo-playbook">CFO Playbook</Link>
                                                </li>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <Link href="/tech-thursday">Tech Thursday</Link>
                                                </li>
                                                <li className="px-2 py-2 hover:bg-gray-100">
                                                    <a
                                                        href="https://itvarnews.techplusmedia.com/"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Tech Disruptors
                                                    </a>
                                                </li>

                                                <li className="px-2 py-2 hover:bg-gray-100 font-sans font-semibold">
                                                    <Link href="/tech-priorities">Tech Priorities</Link>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                            </li>

                            {/* INDUSTRY Dropdown */}
                            <li
                                className="block relative"
                                onMouseEnter={() => handleCategoryHover("industry")}
                                onMouseLeave={handleCategoryLeave}
                            >
                                <Link
                                    href="" // Fixed URL format
                                    className="flex items-center gap-1"
                                >
                                    <p>Industry</p>
                                    <span>
                                        <IoIosArrowDown />
                                    </span>
                                </Link>

                                {activeCategory === "industry" && (
                                    <div className="bg-white shadow-md rounded border border-gray-300 text-sm absolute top-auto left-0 min-w-full w-56 z-30 mt-1">
                                        <ul>
                                            {industryCategories.map((subcategory) => (
                                                <li
                                                    className="px-2 py-2 hover:bg-gray-100"
                                                    key={subcategory.name}
                                                >
                                                    {subcategory.url.startsWith("https") ? (
                                                        <a
                                                            href={subcategory.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <p>{subcategory.name}</p>
                                                        </a>
                                                    ) : (
                                                        <Link href={subcategory.url}>
                                                            <p>{subcategory.name}</p>
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>

                            {/* Technology Dropdown */}
                            <li
                                className="block relative"
                                onMouseEnter={() => handleCategoryHover("technology")}
                                onMouseLeave={handleCategoryLeave}
                            >
                                <Link
                                    href="/technology" // Fixed URL format
                                    className="flex items-center gap-1"
                                >
                                    <p>Technology</p>
                                    <span>
                                        <IoIosArrowDown />
                                    </span>
                                </Link>

                                {activeCategory === "technology" && (
                                    <div className="bg-white shadow-md rounded border border-gray-300 text-sm absolute top-auto left-0 min-w-full w-56 z-30 mt-1">
                                        <ul>
                                            {technologyCategories.map((subcategory) => (
                                                <li
                                                    className="px-2 py-2 hover:bg-gray-100"
                                                    key={subcategory.name}
                                                >
                                                    <Link href={subcategory.url}>
                                                        <p>{subcategory.name}</p>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>

                            {Gallery && (
                                <li
                                    className="block relative"
                                    onMouseEnter={() => handleCategoryHover("Brand Gallery")}
                                    onMouseLeave={handleCategoryLeave}
                                >
                                    <div className="flex items-center gap-1">
                                        <p className="capitalize">{Gallery.attributes.name}</p>
                                        <span>
                                            <IoIosArrowDown />
                                        </span>
                                    </div>

                                    {(activeCategory === "Brand Gallery" ||
                                        hoveredNavItem === "Brand Gallery") && (
                                            <div className="bg-white shadow-md rounded border border-gray-300 text-sm absolute top-auto left-0 min-w-full w-96 z-30 mt-1">
                                                <ul>
                                                    {Gallery.attributes.list
                                                        .slice()
                                                        .reverse()
                                                        .map((listItem, index) => (
                                                            <li
                                                                className="px-2 py-2 hover:bg-gray-100"
                                                                key={index}
                                                            >
                                                                <a href={listItem.url} className="flex gap-2">
                                                                    <Image
                                                                        src={
                                                                            resolveImageUrl(
                                                                                listItem.image?.data?.attributes?.url
                                                                            )
                                                                        }
                                                                        alt={listItem.title || "gallery image"}
                                                                        width={64}
                                                                        height={64}
                                                                        className="object-cover border w-16 h-16"
                                                                    />
                                                                    <div className="flex flex-col justify-center gap-1">
                                                                        <p className="font-fira font-medium">
                                                                            {listItem.title}
                                                                        </p>
                                                                        <p>{listItem.name}</p>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        )}
                                </li>
                            )}

                            {/* Events dropdown */}
                            <li
                                className="block relative"
                                onMouseEnter={() => handleCategoryHover("Events")}
                                onMouseLeave={handleCategoryLeave}
                            >
                                <div className="flex items-center gap-1">
                                    <p>Events</p>
                                    <span>
                                        <IoIosArrowDown />
                                    </span>
                                </div>

                                {(activeCategory === "Events" ||
                                    hoveredNavItem === "Events") && (
                                        <div className="bg-white shadow-md rounded border border-gray-300 text-sm absolute top-auto left-0 min-w-full w-56 z-30 mt-1">
                                            <ul>
                                                {events.map((event, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-2 py-2 hover:bg-gray-100 relative"
                                                        onMouseEnter={() => handleEventHover(event.name)}
                                                    >
                                                        <div className="flex items-center justify-between gap-1">
                                                            <p>{event.name}</p>
                                                            <span className="ml-auto">
                                                                <MdKeyboardArrowRight />
                                                            </span>
                                                        </div>

                                                        {selectedEventCategory === event.name && (
                                                            <div
                                                                className="bg-white shadow-md rounded border border-gray-300 text-sm absolute top-0 right-full min-w-full w-56 z-40"
                                                            >
                                                                <ul>
                                                                    {event.data &&
                                                                        event.data.attributes.list
                                                                            .slice()
                                                                            .reverse()
                                                                            .map((listItem, listIndex) => (
                                                                                <li
                                                                                    className="px-2 py-2 hover:bg-gray-100"
                                                                                    key={listIndex}
                                                                                >
                                                                                    <a href={listItem.url}>
                                                                                        {listItem.title}
                                                                                    </a>
                                                                                </li>
                                                                            ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                            </li>
                        </ul>
                    </div>
                </div>
        </div>
    );
};

export default Navbar;