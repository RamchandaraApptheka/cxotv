"use client"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeaderAdjust from "@/app/(main)/components/HeaderAdjust";
import NavigationMenu from "@/app/(main)/components/NavigationMenu";
import EducationLogo from "../../../../../../public/assets/Education-Technology-logo.png";
import { fetchCategories } from "../../../../../redux/slices/categoriesSlice";
import Footer from "@/app/(main)/components/Footer";

// app/[category]/[title]/layout.js
export default function NewsLayout({ children }) {
    const dispatch = useDispatch();

    // Get categories from Redux store
    const categories = useSelector((state) => state.categories.categories);
    const Education = categories.find(
        (category) => category.attributes.name === "Education Technology"
    );

    useEffect(() => {
        // Fetch categories when component mounts
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <section>
            <HeaderAdjust logo={EducationLogo} homePath="/education-technology" />
            {Education && Education.attributes && Education.attributes.subcategories && (
                <NavigationMenu
                    category={Education}
                    subcategories={Education.attributes.subcategories}
                />
            )}
            {children}

            <Footer />
        </section>
    );
}