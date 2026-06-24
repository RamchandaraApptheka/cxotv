import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

export const fetchLatestNews = createAsyncThunk(
  "latestNews/fetchLatestNews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        '/api/news?populate=*&sort=publishedAt:DESC&pagination[pageSize]=30'
      );

      const data = response?.data?.data || [];
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.attributes?.Date ? new Date(a.attributes.Date) : new Date(a.attributes?.publishedAt);
        const dateB = b.attributes?.Date ? new Date(b.attributes.Date) : new Date(b.attributes?.publishedAt);
        return dateB - dateA;
      });

      return sortedData;
    } catch (error) {
      console.error('Error fetching latest news:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const latestNewsSlice = createSlice({
  name: "latestNews",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestNews.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchLatestNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default latestNewsSlice.reducer;
