import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

const getSessionStorageItem = (key, defaultValue) => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

const initialState = {
  searchTerm: getSessionStorageItem("searchTerm", ""),
  searchResults: [],
  status: "idle",
  error: null,
};

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const searchTerms = searchTerm
        .trim()
        .split(" ")
        .map((term) => encodeURIComponent(term.toLowerCase()));

      const apiUrl = `/api/news?filters[slug][$containsi]=${searchTerms.join(
        "&filters[slug][$containsi]="
      )}&populate=*&pagination[pageSize]=90&sort=publishedAt:DESC`;

      const response = await apiClient.get(apiUrl);

      const data = response?.data?.data || [];
      const sortedResults = [...data].sort((a, b) => {
        const slugA = a.attributes?.slug?.toLowerCase() || '';
        const slugB = b.attributes?.slug?.toLowerCase() || '';
        const matchCountA = searchTerms.filter((term) => slugA.includes(term)).length;
        const matchCountB = searchTerms.filter((term) => slugB.includes(term)).length;
        return matchCountB - matchCountA;
      });

      return sortedResults;
    } catch (error) {
      console.error("Error fetching search results:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      const searchTerm = action.payload;
      state.searchTerm = searchTerm;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("searchTerm", searchTerm);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = "loading";
        state.searchResults = [];
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm } = searchSlice.actions;

export default searchSlice.reducer;
