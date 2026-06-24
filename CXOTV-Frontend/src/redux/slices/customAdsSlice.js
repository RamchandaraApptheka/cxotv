import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
  AdData: [],
  isAdLoading: false,
  isError: false,
};

export const fetchCustomAds = createAsyncThunk('customAds/fetchCustomAds', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/api/costom-ads?populate=image');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching custom ads:', error.message);
    return rejectWithValue(error.message);
  }
});

const customAdsSlice = createSlice({
  name: 'customAds',
  initialState,
  reducers: {
    setAds: (state, action) => {
      state.AdData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomAds.pending, (state) => {
        state.isAdLoading = true;
        state.isError = false;
      })
      .addCase(fetchCustomAds.fulfilled, (state, action) => {
        state.isAdLoading = false;
        state.isError = false;
        state.AdData = action.payload;
      })
      .addCase(fetchCustomAds.rejected, (state) => {
        state.isAdLoading = false;
        state.isError = true;
      });
  },
});

export const { setAds } = customAdsSlice.actions;

export default customAdsSlice.reducer;
