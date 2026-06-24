'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BACKEND_URL } from '@/utils/env';

const FollowBar = () => {
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/social-media-links`
                );
                setSocialLinks(response.data.data);
            } catch (error) {
                console.error("Error fetching social media links:", error);
            }
        };

        fetchSocialLinks();
    }, []);

    const getIconForPlatform = (platformName) => {
        switch (platformName.toLowerCase()) {
            case "twitter":
            case "x":
                return <FaXTwitter className="text-2xl text-black" />;
            case "linkedin":
                return <FaLinkedin className="text-2xl text-blue-700" />;
            case "instagram":
                return <FaInstagram className="text-2xl text-pink-600" />;
            case "youtube":
                return <FaYoutube className="text-2xl text-red-600" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <p className="font-bold">Follow and connect with us on:</p>
            {socialLinks.map((link) => (
                <a
                    key={link.id}
                    href={link.attributes.platformURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900"
                    title={link.attributes.ctaMessage}
                >
                    {getIconForPlatform(link.attributes.platformName)}
                </a>
            ))}
        </div>
    );
};

export default FollowBar;