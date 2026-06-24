import { Suspense } from "react";
import HomePage from './HomePage';
import { createServerComponentClient } from "./serverActions.js";
import { FRONTEND_URL } from '@/utils/env';

import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import { fetchCategories } from "../../../redux/slices/categoriesSlice";
import { fetchNavbars } from "../../../redux/slices/navbarSlice";
import { fetchLatestNewsByNames } from "../../../redux/slices/sectionSlice";
import { fetchShortsUrl } from "../../../redux/slices/youtubeSlice";
import { fetchNewsByName } from "../../../redux/slices/newsSlice";
import { names } from "@/utils/homePageConfig";

export const metadata = {
    title: 'Latest Technology News - CXOTV Today & Tech Updates',
    description: 'Stay updated with the latest technology news, CXO insights, and expert opinions on CXO TV. Get the latest tech updates and exclusive interviews.',
    keywords: 'technology news, CXO TV, tech updates, latest tech trends, digital transformation',
    openGraph: {
        title: 'Latest Technology News - CXOTV Today & Tech Updates',
        type: 'website',
        url: FRONTEND_URL,
    }
};

async function Home() {
    let serverData = {
        ads: null,
        categories: null,
        navbars: null,
        sectionNews: null,
        youtubeUrl: null,
        newsData: {},
    };

    try {
        const { store } = await createServerComponentClient();

        // 1. Fetch static configurations & global data in parallel
        await Promise.all([
            store.dispatch(fetchCustomAds()),
            store.dispatch(fetchCategories()),
            store.dispatch(fetchNavbars()),
            store.dispatch(fetchLatestNewsByNames(names)),
            store.dispatch(fetchShortsUrl()),
        ]);

        // 2. Fetch all category news in parallel
        const homeCategories = [
            "Tech Thursday",
            "BFSI",
            "Health Technology",
            "Education Technology",
            "Marketing Mondays",
            "Technology",
            "Interviews",
            "what's popular",
            "editor's choice"
        ];
        
        await Promise.all(
            homeCategories.map(cat => store.dispatch(fetchNewsByName({ nameParam: cat })))
        );

        // Get states from server store after fetching
        const state = store.getState();
        serverData = {
            ads: state.customAds.AdData,
            categories: state.categories.categories,
            navbars: state.navbars.navbars,
            sectionNews: state.SectionNews.sectionNews,
            youtubeUrl: state.youtube.url,
            newsData: state.news.data,
        };
    } catch (error) {
        console.error('Error fetching home page data on server:', error);
    }

    return (
        <>
            <Suspense fallback={null}>
            </Suspense>

            <HomePage serverData={serverData} />
        </>
    );
}

export default Home;