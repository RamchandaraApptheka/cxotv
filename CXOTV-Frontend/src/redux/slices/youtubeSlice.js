import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

export const fetchShortsUrl = createAsyncThunk(
  'youtube/fetchShortsUrl',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/shortss?populate=*&sort=publishedAt:DESC&pagination[pageSize]=1');
      return response?.data?.data?.[0]?.attributes?.ShortsUrl || '';
    } catch (error) {
      console.error('Error fetching shorts URL:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

const youtubeSlice = createSlice({
  name: 'youtube',
  initialState: {
    url: '',
    isLoading: false,
    isError: false
  },
  reducers: {
    setShortsUrl: (state, action) => {
      state.url = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShortsUrl.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShortsUrl.fulfilled, (state, action) => {
        state.url = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchShortsUrl.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  }
});

export const { setShortsUrl } = youtubeSlice.actions;

export default youtubeSlice.reducer;
