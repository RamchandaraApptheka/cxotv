import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

const initialState = {
  data: {},
  isLoading: false,
  isError: false,
};

export const fetchNewsByName = createAsyncThunk(
  'news/fetchByName',
  async ({ nameParam }, { rejectWithValue }) => {
    try {
      const encodedName = encodeURIComponent(nameParam);
      const response = await apiClient.get(
        `/api/news?populate=*&filters[$or][0][categories][name][$eq]=${encodedName}&filters[$or][1][subcategories][name][$eq]=${encodedName}&sort=publishedAt:DESC`
      );

      const data = response?.data?.data || [];
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.attributes?.Date ? new Date(a.attributes.Date) : new Date(a.attributes?.publishedAt);
        const dateB = b.attributes?.Date ? new Date(b.attributes.Date) : new Date(b.attributes?.publishedAt);
        return dateB - dateA;
      });

      return { nameParam, data: sortedData };
    } catch (error) {
      console.error('Error fetching news data:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setBulkNewsData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsByName.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNewsByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const { nameParam, data } = action.payload;
        state.data[nameParam] = data;
      })
      .addCase(fetchNewsByName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        console.error('Fetch rejected with error:', action.payload);
      });
  },
});

export const { setBulkNewsData } = newsSlice.actions;

export default newsSlice.reducer;
