import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

const initialState = {
  singleNewsItem: null,
  isLoading: false,
  isError: false,
};

export const fetchSingleNewsByTitle = createAsyncThunk(
  "singleNews/fetchByTitle",
  async ({ title, categoryName }, { rejectWithValue }) => {
    try {
      let url = `/api/news?populate=*&filters[slug][$eq]=${title}`;

      if (categoryName) {
        url += `&filters[$or][0][subcategories][name][$eqi]=${encodeURIComponent(categoryName)}`;
        url += `&filters[$or][1][categories][name][$eqi]=${encodeURIComponent(categoryName)}`;
      }

      const response = await apiClient.get(url);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching single news:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const singleNewsSlice = createSlice({
  name: "singleNews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleNewsByTitle.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSingleNewsByTitle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.singleNewsItem = action.payload;
      })
      .addCase(fetchSingleNewsByTitle.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.singleNewsItem = null;
      });
  },
});

export default singleNewsSlice.reducer;
