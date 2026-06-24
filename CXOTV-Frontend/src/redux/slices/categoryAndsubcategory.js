import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

const initialState = {
  data: [],
  isLoading: true,
  isError: false,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 25,
};

export const fetchNewscategoryAndsubcategory = createAsyncThunk(
  "categoryAndsubcategory/fetchNewscategoryAndsubcategory",
  async ({ nameParam, page }, { rejectWithValue }) => {
    try {
      const encodedName = encodeURIComponent(nameParam);
      const response = await apiClient.get(
        `/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=${encodedName}&filters[$or][1][subcategories][name][$eq]=${encodedName}&pagination[page]=${page}`
      );

      const data = response?.data?.data || [];
      const meta = response?.data?.meta;

      const sortedData = [...data].sort((a, b) => {
        const dateA = a.attributes?.Date ? new Date(a.attributes.Date) : new Date(a.attributes?.publishedAt);
        const dateB = b.attributes?.Date ? new Date(b.attributes.Date) : new Date(b.attributes?.publishedAt);
        return dateB - dateA;
      });

      return {
        data: sortedData,
        totalPages: meta?.pagination?.pageCount || 1,
      };
    } catch (error) {
      console.error("Error fetching category news:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const categoryAndsubcategoryNewsSlice = createSlice({
  name: "categoryAndsubcategoryNews",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewscategoryAndsubcategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNewscategoryAndsubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchNewscategoryAndsubcategory.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setCurrentPage } = categoryAndsubcategoryNewsSlice.actions;

export default categoryAndsubcategoryNewsSlice.reducer;
