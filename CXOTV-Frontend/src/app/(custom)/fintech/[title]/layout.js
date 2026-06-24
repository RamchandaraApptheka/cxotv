"use client"

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeaderAdjust from "@/app/(main)/components/HeaderAdjust";
import NavigationMenu from "@/app/(main)/components/NavigationMenu";
import bfsiLogo from "../../../../../public/assets/BFSI-Fintech-logo.png";
import { fetchCategories } from "../../../../redux/slices/categoriesSlice";
import Footer from "@/app/(main)/components/Footer";

// app/[category]/[title]/layout.js
export default function NewsLayout({ children }) {
    const dispatch = useDispatch();

    // Get categories from Redux store
    const categories = useSelector((state) => state.categories.categories);
    const BFSI = categories.find(
        (category) => category.attributes.name === "BFSI"
    );

    useEffect(() => {
        // Fetch categories when component mounts
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <section>
            <HeaderAdjust logo={bfsiLogo} homePath="/bfsi" />
            {children}

            <Footer />
        </section>
    );
}