import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

const initialState = {
  data: {
    APAC: [],
    EMEA: [],
    INDIA: [],
    USA: [],
    "Trending News": [],
  },
  isLoading: false,
  isError: false,
};

export const fetchRegionNews = createAsyncThunk(
  "regionNews/fetchRegionNews",
  async (region, { rejectWithValue }) => {
    try {
      const encodedRegion = encodeURIComponent(region);
      const response = await apiClient.get(
        `/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=${encodedRegion}&filters[$or][1][subcategories][name][$eq]=${encodedRegion}&pagination[pageSize]=20`
      );

      const data = response?.data?.data || [];
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.attributes?.Date ? new Date(a.attributes.Date) : new Date(a.attributes?.publishedAt);
        const dateB = b.attributes?.Date ? new Date(b.attributes.Date) : new Date(b.attributes?.publishedAt);
        return dateB - dateA;
      });

      return { region, data: sortedData };
    } catch (error) {
      console.error('Error fetching region news:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const regionNewsSlice = createSlice({
  name: "regionNews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegionNews.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchRegionNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data[action.payload.region] = action.payload.data;
      })
      .addCase(fetchRegionNews.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default regionNewsSlice.reducer;
