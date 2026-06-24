import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./slices/newsSlice";
import categoryAndsubcategoryNewsReducer from "./slices/categoryAndsubcategory";
import singleNewsReducer from "./slices/singleNewsSlice";
import latestNewsReducer from "./slices/latestNews";
import customAdsReducer from "./slices/customAdsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import navbarsReducer from "./slices/navbarSlice";
import specificCategoryNewsReducer from "./slices/specificCategorySlice";
import searchReducer from "./slices/searchSlice";
import youtubeReducer from './slices/youtubeSlice';
import regionNewsSliceReducer from "./slices/regionNewsSlice";
import sectionSliceReducer from "./slices/sectionSlice";

const rootReducer = {
  news: newsReducer,
  categoryAndsubcategoryNews: categoryAndsubcategoryNewsReducer,
  singleNews: singleNewsReducer,
  latestNews: latestNewsReducer,
  customAds: customAdsReducer,
  categories: categoriesReducer,
  navbars: navbarsReducer,
  specificCategoryNews: specificCategoryNewsReducer,
  search: searchReducer,
  youtube: youtubeReducer,
  regionNews: regionNewsSliceReducer,
  SectionNews: sectionSliceReducer,
};

export const createStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Create and export the store instance
const store = createStore();

export default store;