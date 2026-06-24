'use client';

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

const CommunityNavbar = ({ links = [] }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accordionState, setAccordionState] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 1023);

        // Initial check
        checkMobile();

        // Add resize listener
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleAccordion = (categoryName) => {
        setAccordionState((prevState) => ({
            ...prevState,
            [categoryName]: !prevState[categoryName],
        }));
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className="bg-white p-4">
            <div className="flex justify-between items-center">
                {isMobile && (
                    <button
                        onClick={toggleMobileMenu}
                        className="bg-white text-black flex gap-2 items-center p-2 rounded shadow-md border border-gray-300 mx-auto"
                    >
                        {mobileMenuOpen ? (
                            <div className="flex gap-2 items-center">
                                Menu <FaTimes size={16} />
                            </div>
                        ) : (
                            <div className="flex gap-2 items-center">
                                Menu <FaBars size={16} />
                            </div>
                        )}
                    </button>
                )}
            </div>

            {/* Mobile Menu */}
            {isMobile && mobileMenuOpen && (
                <div className="w-full mt-2 font-fira text-black capitalize font-medium text-[15px]">
                    <ul className="flex flex-col gap-2">
                        {links.map((link, index) => (
                            <li key={index} className="relative">
                                <button
                                    onClick={() => link.subLinks && toggleAccordion(link.name)}
                                    className="w-full flex justify-between items-center py-2 px-4 hover:bg-gray-100"
                                >
                                    {link.name || "Menu Item"}
                                    {link.subLinks && (
                                        <IoIosArrowDown
                                            className={`transition-transform ${accordionState[link.name] ? 'rotate-180' : ''}`}
                                            size={16}
                                        />
                                    )}
                                </button>
                                {link.subLinks && accordionState[link.name] && (
                                    <ul className="flex flex-col mt-2 shadow-lg text-black font-medium capitalize cursor-pointer font-fira text-[15px]">
                                        {link.subLinks.map((subLink, subIndex) => (
                                            <li key={subIndex} className="py-2 px-4 hover:bg-gray-300">
                                                <Link href={subLink.path || "#"} className="block">
                                                    {subLink.name || "Submenu Item"}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Desktop Menu */}
            {!isMobile && (
                <div className="w-full cursor-pointer font-fira text-black capitalize font-medium text-[15px]">
                    <ul className="flex flex-wrap items-center justify-center gap-8 mt-5 mb-5 mx-auto">
                        {links.map((link, index) => (
                            <li key={index} className="relative group">
                                <Link
                                    href={link.path || "#"}
                                    className="block py-2 px-4 hover:text-gray-600"
                                >
                                    {link.name || "Menu Item"}
                                </Link>
                                {link.subLinks && (
                                    <ul className="absolute left-0 top-full mt-2 bg-white border border-gray-300 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-20 text-black font-medium capitalize cursor-pointer font-fira text-[15px]">
                                        {link.subLinks.map((subLink, subIndex) => (
                                            <li key={subIndex} className="py-2 px-4 w-48 hover:bg-gray-100">
                                                <Link href={subLink.path || "#"} className="block">
                                                    {subLink.name || "Submenu Item"}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default CommunityNavbar;