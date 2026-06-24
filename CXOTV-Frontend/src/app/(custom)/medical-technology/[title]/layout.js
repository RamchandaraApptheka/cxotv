"use client"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeaderAdjust from "@/app/(main)/components/HeaderAdjust";
import NavigationMenu from "@/app/(main)/components/NavigationMenu";
import healthLogo from "../../../../../public/assets//Health-Technology-Logo.png";
import { fetchCategories } from "../../../../redux/slices/categoriesSlice";
import Footer from "@/app/(main)/components/Footer";
import NavigationMenuthree from "@/app/(main)/components/NavigationMenuthree";

// app/[category]/[title]/layout.js
export default function NewsLayout({ children }) {
    const dispatch = useDispatch();

    // Get categories from Redux store
    const categories = useSelector((state) => state.categories.categories);
    const Health = categories.find(
        (category) => category.attributes.name === "Health Technology"
    );

    useEffect(() => {
        // Fetch categories when component mounts
        dispatch(fetchCategories());
    }, [dispatch]);
    // Helper: normalize various subcategory shapes to an array
    const normalizeSubcategories = (subcats) => {
        if (!subcats) return [];
        if (Array.isArray(subcats)) return subcats;
        if (Array.isArray(subcats.data)) return subcats.data;
        if (subcats.data && Array.isArray(subcats.data.data)) return subcats.data.data;
        return [];
    };

    // Safe getters for slug / name from different shapes
    const getSlug = (sub) =>
        sub?.attributes?.slug || sub?.slug || sub?.attributes?.name || sub?.name || "";
    const getName = (sub) =>
        sub?.attributes?.name || sub?.name || sub?.attributes?.slug || sub?.slug || "";

    // Build filtered subcategories (exclude health-cxo-talks and anything with "health cxo")
    const rawSubcategories = Health?.attributes?.subcategories;
    const normalized = normalizeSubcategories(rawSubcategories);

    const filteredSubcategories = normalized.filter((sub) => {
        const slug = String(getSlug(sub)).toLowerCase();
        const name = String(getName(sub)).toLowerCase();
        if (slug === "health-cxo-talks") return false;
        if (name.includes("health cxo") || name.includes("health-cxo")) return false;
        return true;
    });

    // Wrap into the shape NavigationMenuthree expects
    const subcategoriesForMenu = { data: filteredSubcategories || [] };

    return (
        <section>
            <HeaderAdjust logo={healthLogo} homePath='/health-technology' />
            {Health && (
                <NavigationMenuthree
                    category={Health}
                    subcategories={subcategoriesForMenu}
                />
            )}
            {children}

            <Footer />
        </section>
    );
}