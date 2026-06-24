'use client';

import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import {
    FaFacebook,
    FaLinkedin,
    FaInstagram,
    FaYoutube,
    FaUserCircle,
    FaUser,
    FaBuilding,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BACKEND_URL } from '@/utils/env';

const SocialMediaPopup = ({ showPopup, setShowPopup }) => {
    const [subscribed, setSubscribed] = useState(false);
    const [socialMediaLinks, setSocialMediaLinks] = useState([]);
    const [formData, setFormData] = useState({
        FullName: "",
        CompanyName: "",
        Phone: "",
        Email: "",
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userSubscribed = localStorage.getItem("subscribed");
            if (userSubscribed) {
                setSubscribed(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!showPopup || socialMediaLinks.length > 0) return;

        const fetchSocialMediaLinks = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/social-media-links`
                );
                const data = await response.json();
                setSocialMediaLinks(data.data);
            } catch (error) {
                console.error("Error fetching social media links:", error);
            }
        };

        fetchSocialMediaLinks();
    }, [showPopup, socialMediaLinks.length]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || BACKEND_URL}/api/news-latters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: formData }),
            });
            setShowPopup(false);
            setSubscribed(true);
            if (typeof window !== 'undefined') {
                localStorage.setItem("subscribed", "true");
            }
        } catch (error) {
            console.error("Error posting data:", error);
        }
    };

    const getIconForPlatform = (platformName) => {
        switch (platformName.toLowerCase()) {
            case "facebook":
                return <FaFacebook className="mr-2 text-blue-600 text-3xl" />;
            case "twitter":
                return <FaXTwitter className="mr-2 text-black text-3xl" />;
            case "linkedin":
                return <FaLinkedin className="mr-2 text-blue-700 text-3xl" />;
            case "instagram":
                return <FaInstagram className="mr-2 text-pink-600 text-3xl" />;
            case "youtube":
                return <FaYoutube className="mr-2 text-red-600 text-3xl" />;
            default:
                return null;
        }
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg max-w-lg relative shadow-2xl w-11/12 md:w-auto">
                <button
                    className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowPopup(false)}
                >
                    <RxCross1 className="w-6 h-6" />
                </button>

                <div className="text-center mb-4">
                    <FaUserCircle className="mx-auto text-gray-600 text-4xl mb-2" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Stay Connected with Us!
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Follow us on social media and subscribe to our newsletter.
                    </p>
                </div>

                <ul className="space-y-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:gap-4 gap-1">
                    {socialMediaLinks.map(
                        (link) =>
                            link.attributes.showOnPopup && (
                                <li
                                    key={link.id}
                                    className="flex items-center justify-start"
                                >
                                    <a
                                        href={link.attributes.platformURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-gray-800 hover:text-gray-500"
                                    >
                                        {getIconForPlatform(link.attributes.platformName)}
                                        <span className="text-sm">{link.attributes.ctaMessage}</span>
                                    </a>
                                </li>
                            )
                    )}
                </ul>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <div className="relative">
                            <FaUser className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                id="fullName"
                                name="FullName"
                                value={formData.FullName}
                                onChange={handleChange}
                                placeholder="Full Name*"
                                className="pl-10 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                id="companyName"
                                name="CompanyName"
                                value={formData.CompanyName}
                                onChange={handleChange}
                                placeholder="Company Name"
                                className="pl-10 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="tel"
                                id="phone"
                                name="Phone"
                                value={formData.Phone}
                                onChange={handleChange}
                                placeholder="Phone*"
                                className="pl-10 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                minLength={10}
                                maxLength={10}
                                required
                            />
                        </div>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                placeholder="Email*"
                                className="pl-10 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setShowPopup(false)}
                            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg mt-4 transition-colors w-5/12"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition-colors w-5/12"
                        >
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SocialMediaPopup;