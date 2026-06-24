import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/utils/apiClient';

const initialState = {
  navbars: [],
  isLoading: false,
  isError: false,
};

export const fetchNavbars = createAsyncThunk('navbars/fetchNavbars', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/api/navbars?populate[0]=list&populate[1]=list.image');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching navbars:', error.message);
    return rejectWithValue(error.message);
  }
});

const navbarsSlice = createSlice({
  name: 'navbars',
  initialState,
  reducers: {
    setNavbars: (state, action) => {
      state.navbars = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavbars.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNavbars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.navbars = action.payload;
      })
      .addCase(fetchNavbars.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setNavbars } = navbarsSlice.actions;

export default navbarsSlice.reducer;
