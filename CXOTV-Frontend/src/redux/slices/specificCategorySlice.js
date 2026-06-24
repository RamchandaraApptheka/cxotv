import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
};

export const fetchSpecificCategorySlice = createAsyncThunk(
  "categoryAndsubcategory/fetchSpecificCategorySlice",
  async ({ nameParam }, { rejectWithValue }) => {
    try {
      const encodedName = encodeURIComponent(nameParam);
      const response = await apiClient.get(
        `/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=${encodedName}&filters[$or][1][subcategories][name][$eq]=${encodedName}&pagination[pageSize]=20`
      );

      const newsData = response?.data?.data || [];
      const sortedNewsData = [...newsData].sort((a, b) => {
        const dateA = a.attributes?.Date ? new Date(a.attributes.Date) : new Date(a.attributes?.publishedAt);
        const dateB = b.attributes?.Date ? new Date(b.attributes.Date) : new Date(b.attributes?.publishedAt);
        return dateB - dateA;
      });

      return sortedNewsData;
    } catch (error) {
      console.error('Error fetching specific category:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const specificCategorySlice = createSlice({
  name: "specificCategoryNews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecificCategorySlice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSpecificCategorySlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(fetchSpecificCategorySlice.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default specificCategorySlice.reducer;
