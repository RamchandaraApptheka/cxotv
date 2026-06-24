import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

export const fetchLatestNewsByNames = createAsyncThunk(
  "news/fetchLatestNewsByNames",
  async (names, { rejectWithValue }) => {
    try {
      const responses = await Promise.all(
        names.map(async (name) => {
          try {
            const encodedName = encodeURIComponent(name);
            const response = await apiClient.get(
              `/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=${encodedName}&filters[$or][1][subcategories][name][$eq]=${encodedName}&pagination[pageSize]=1`
            );
            return { name, news: response?.data?.data?.[0] || null };
          } catch (err) {
            console.error(`Error fetching news for ${name}:`, err.message);
            return { name, news: null };
          }
        })
      );
      return responses;
    } catch (err) {
      console.error("Error fetching section news:", err.message);
      return rejectWithValue(err.message);
    }
  }
);

const sectionSlice = createSlice({
  name: "SectionNews",
  initialState: {
    sectionNews: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setSectionNews: (state, action) => {
      state.sectionNews = action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestNewsByNames.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLatestNewsByNames.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sectionNews = action.payload;
      })
      .addCase(fetchLatestNewsByNames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSectionNews } = sectionSlice.actions;

export default sectionSlice.reducer;
