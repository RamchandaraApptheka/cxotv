"use client"

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/assets/cxotvlogo.png"
import { useDispatch, useSelector } from "react-redux";
import { fetchNavbars } from "../../../redux/slices/navbarSlice";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
    FaGooglePlusG,
    FaYoutube,
    FaFacebookF,
    FaLinkedinIn,
    FaInstagram
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FRONTEND_URL } from '@/utils/env';

const socialMediaIcons = [
    { icon: FaFacebookF, link: "https://www.facebook.com/cxotvnews" },
    { icon: FaXTwitter, link: "https://twitter.com/cxotvnews" },
    { icon: FaInstagram, link: "https://www.instagram.com/cxotv_news/" },
    {
        icon: FaYoutube,
        link: "https://www.youtube.com/channel/UCNSQbKNLmJBhCBCIR0ZqqPA",
    },
    {
        icon: FaGooglePlusG,
        link: "https://plus.google.com/108595194843844418664",
    },
    { icon: FaLinkedinIn, link: "https://www.linkedin.com/company/cxotvnews" },
];

const resourceItems = [
    "Interviews",
    "Budget Stories",
    "Daily News Capsule",
    "CXO Connect",
    "Case Study",
    "Business Impact",
    "CFO Playbook",
    "m health",
    "Tech connect",
];

const cxotvCommunityOptions = [
    { name: "BFSI", url: "/BFSI" },
    { name: "Health", url: "/Health-Technology" },
    { name: "Education", url: "/Education-Technology" },
    { name: "Tech Disruptops", url: "https://itvarnews.techplusmedia.com/" },
];
const ourService = [
    {
        name: "Abm Services",
        url: "https://www.techplusmedia.com/techplus-media-abm-services.html",
    },
    {
        name: "Content Marketing",
        url: "https://www.techplusmedia.com/techplus-media-content-marketing.html",
    },
    {
        name: "Database & Analytics",
        url: "https://www.techplusmedia.com/techplus-media-database-and-analytics.html",
    },
    { name: "Events", url: "https://www.techplusmedia.com/b2b-events.html" }, // kept here (top section)
    {
        name: "Marketplace",
        url: "https://www.techplusmedia.com/techplus-media-marketplace.html",
    },
    {
        name: "Partner Marketing",
        url: "https://www.techplusmedia.com/techplus-media-partner-marketing.html",
    },
    {
        name: "Sales Enablement",
        url: "https://www.techplusmedia.com/techplus-media-sales-enablement.html",
    },
    {
        name: "Video/Studio Services",
        url: "https://www.techplusmedia.com/techplus-media-video-studio.html",
    },
    {
        name: "Careers",
        url: "https://www.techplusmedia.com/techplus-media-career.html",
    },
];

const discoverItems = ["CIO Agenda", "CXO AGENDA", "Technology", "Archive"];

const eventsItems = [
    "CXO Tech Summit",
    "CXO Cloud Summit",
    "Global Security Summit",
    "Data Intelligence & AI Summit",
    "CXO BFSI Summit",
];

const chatSeriesItems = [
    "talks-with-kalpana",
    "CEO Talk",
    "Marketing Mondays",
    "Tech Thursday",
    "CFO Playbook",
];

const Footer = () => {
    const navbars = useSelector((state) => state.navbars.navbars);
    const dispatch = useDispatch();
    const events = [
        {
            name: "Past Events",
            data: navbars.find((item) => item.attributes.name === "Past Events"),
        },
    ];

    useEffect(() => {
        if (!navbars || navbars.length === 0) {
            dispatch(fetchNavbars());
        }
    }, [dispatch, navbars]);

    const eventsList = events[0]?.data?.attributes?.list || [];
    const reversedEventsList = eventsList.slice().reverse();
    const firstFiveReversedEvents = reversedEventsList.slice(0, 5);

    // Bottom links explicitly defined so we can control/hide specific links (e.g., "Events" removed here)
    const bottomLinks = [
        { label: "About Us", href: "/About-Us" },
        { label: "Editorial Team", href: `${FRONTEND_URL}/editorial-team`, external: true },
        { label: "Editorial Guidelines", href: `${FRONTEND_URL}/editorial-guidelines`, external: true },
        { label: "Terms of Service", href: `${FRONTEND_URL}/terms-of-service`, external: true },
        { label: "Advertising", href: "/advertising" },
        { label: "Privacy Policy", href: "/Privacy-Policy" },
    ];

    return (
        <div className="flex flex-col items-center w-full h-full font-segoe font-normal text-[14px] pt-10 bg-darkpurple text-white bg-[#1E023D]">
            {/* Top section */}
            <div className="w-full lg:px-12 px-4 lg:flex pb-4 justify-evenly">
                {/* Resource Section */}
                <div className="w-full lg:w-[25%]">
                    <div className="flex flex-col justify-center">
                        <div className="text-[#29A3DE] font-fira pb-2 font-normal text-[20px]">
                            RESOURCE
                        </div>
                        <div className="sansfont-tech flex flex-col lg:gap-2 gap-1 cursor-pointer">
                            {resourceItems.map((r, i) => (
                                <Link key={i} href={`/${r.split(" ").join("-").toLowerCase()}`}>
                                    <div className="flex gap-1 items-center">
                                        <MdKeyboardArrowRight /> <p>{r}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Our Services Section */}
                <div className="w-full lg:w-[25%] lg:pt-0 pt-6">
                    <div className="flex flex-col justify-center">
                        <div className="text-[#29A3DE] font-fira pb-2 font-normal text-[20px]">
                            OUR SERVICES
                        </div>
                        <div className="sansfont-tech flex flex-col lg:gap-2 gap-1 cursor-pointer">
                            {ourService.map((c, i) => (
                                <a
                                    key={i}
                                    href={c.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="flex gap-1 items-center">
                                        <MdKeyboardArrowRight /> <p>{c.name}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Community & Discover Section */}
                <div className="w-full lg:w-[25%] flex lg:flex-col gap-10 lg:pt-0 pt-6">
                    {/* Community */}
                    <div>
                        <div className="flex flex-col justify-center">
                            <div className="text-[#29A3DE] font-fira pb-2 font-normal text-[20px]">
                                COMMUNITY
                            </div>
                            <div className="sansfont-tech flex flex-col lg:gap-2 gap-1 cursor-pointer">
                                {cxotvCommunityOptions.map((c, i) =>
                                    c.url.startsWith("https") ? (
                                        <a
                                            key={i}
                                            href={c.url.toLowerCase()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex gap-1 items-center"
                                        >
                                            <MdKeyboardArrowRight /> <p>{c.name}</p>
                                        </a>
                                    ) : (
                                        <Link key={i} href={c.url.toLowerCase()}>
                                            <div className="flex gap-1 items-center">
                                                <MdKeyboardArrowRight /> <p>{c.name}</p>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Discover */}
                    <div>
                        <div className="flex flex-col justify-center">
                            <div className="text-[#29A3DE] font-fira pb-2 font-normal text-[20px]">
                                DISCOVER
                            </div>
                            <div className="sansfont-tech flex flex-col lg:gap-2 gap-1 cursor-pointer">
                                {discoverItems.map((d, i) => {
                                    // Special case for Archive to link to external URL
                                    if (d === "Archive") {
                                        return (
                                            <a
                                                key={i}
                                                href="https://apac.cxotv.news/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex gap-1 items-center"
                                            >
                                                <MdKeyboardArrowRight /> <p>{d}</p>
                                            </a>
                                        );
                                    } else {
                                        return (
                                            <Link key={i} href={`/${d.split(" ").join("-").toLowerCase()}`}>
                                                <div className="flex gap-1 items-center">
                                                    <MdKeyboardArrowRight /> <p>{d}</p>
                                                </div>
                                            </Link>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events & Chat Series Section */}
                <div className="w-full lg:w-[25%] flex lg:flex-col gap-4 pt-6 lg:pt-0">
                    {/* Events */}
                    {/* <div>
                        <div className="flex flex-col justify-center">
                            <div className="text-[#29A3DE] font-fira pb-2 font-normal text-[20px]">
                                EVENTSa
                            </div>
                            <div className="sansfont-tech flex flex-col lg:gap-2 gap-1 cursor-pointer">
                                {firstFiveReversedEvents.map((event) => (
                                    <Link key={event.id} href={event.url}>
                                        <div className="flex gap-1 items-center">
                                            <MdKeyboardArrowRight /> <p>{event.title}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div> */}

                    {/* Chat Series */}
                    <div>
                        <div className="flex flex-col justify-center">
                            <div className="text-[#29A3DE] font-fira pb-2 font-normal text-[20px]">
                                CHAT Series
                            </div>
                            <div className="sansfont-tech flex flex-col lg:gap-2 gap-1 cursor-pointer">
                                {chatSeriesItems.map((ch, i) => (
                                    <Link key={i} href={`/${ch.split(" ").join("-").toLowerCase()}`}>
                                        <div className="flex gap-1 items-center">
                                            <MdKeyboardArrowRight /> <p>{ch}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle section */}
            <div className="w-full lg:px-12 lg:flex justify-evenly px-4">
                {/* Logo */}
                <div className="w-full lg:w-[25%] flex items-center lg:border-t lg:border-b lg:border-[#AFA5BA] lg:py-4">
                    <a href="https://www.techplusmedia.com/">
                        <Image
                            src={Logo}
                            alt="footer_logo"
                            width={150}
                            priority
                            style={{ height: 'auto' }}
                            className="object-contain"
                        />
                    </a>
                </div>

                {/* Contact Us */}
                <div className="w-full lg:w-[25%] items-center lg:border-t lg:border-b lg:border-[#AFA5BA] lg:py-4">
                    <div className="sansfont-tech flex flex-col text-[17px] gap-2">
                        <p className="text-[#29A3DE] font-fira lg:pb-2 pb-0 lgpt-0 pt-2 font-normal text-[20px]">
                            <a href="https://www.techplusmedia.com/techplus-media-contact.html">
                                Contact Us
                            </a>
                        </p>
                        <p className="text-[#AFA5BA]">
                            Editorial :{" "}
                            <span className="text-[15px] text-white">
                                editor( at)cxotv( dot)news
                            </span>
                        </p>

                        <p className="text-[#AFA5BA]">
                            Sales :{" "}
                            <a
                                href="mailto:sales@techplusmedia.co.in"
                                className="text-[15px] text-white"
                            >
                                sales( at)techplusmedia( dot)com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Social Media */}
                <div className="w-full lg:w-[25%] items-center lg:border-t lg:border-b lg:border-[#AFA5BA] lg:py-4">
                    <div className="flex flex-col justify-center">
                        <div className="text-[#29A3DE] font-fira pb-2 lg:pt-0 pt-2 font-normal text-[20px]">
                            STAY CONNECTED
                        </div>
                        <div className="flex gap-4 lg:py-4">
                            {socialMediaIcons.map((iconData, index) => (
                                <a
                                    key={index}
                                    href={iconData.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon rounded-full"
                                >
                                    <div className="bg-red-600 rounded-full p-2 hover:bg-blue-600 transition-all duration-200">
                                        {<iconData.icon />}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[25%] items-center lg:border-t lg:border-b lg:border-[#AFA5BA] lg:py-4"></div>
            </div>

            {/* Bottom section */}
            <div className="w-full lg:px-12 px-4 lg:flex py-4 justify-between">
                <div className="py-2 lg:py-0">
                    © 2026 ALL RIGHTS RESERVED. CXO TV
                </div>

                <div className="flex lg:gap-2 gap-4 pr-6">
                    <div className="flex flex-row lg:gap-8  gap-2 ">
                        {bottomLinks.map((link, i) => {
                            return (
                                <div
                                    key={i}
                                    className="text-[15px]   text-[#AFA5BA] hover:text-white   cursor-pointer transition-all duration-200 "
                                >
                                    {link.external ? (
                                        <a
                                            className="capitalize"
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link className="capitalize" href={link.href}>
                                            {link.label}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
