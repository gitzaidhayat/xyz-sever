import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '../../api/wishlistApi';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    return await wishlistApi.getWishlist();
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to load wishlist');
  }
});

export const addWishlistItem = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    return await wishlistApi.addToWishlist(productId);
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to add item');
  }
});

export const removeWishlistItem = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    return await wishlistApi.removeFromWishlist(productId);
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to remove item');
  }
});

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload.items || []; })
      .addCase(fetchWishlist.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(addWishlistItem.fulfilled, (state, action) => { state.items = action.payload.items || state.items; })
      .addCase(removeWishlistItem.fulfilled, (state, action) => { state.items = action.payload.items || state.items; });
  }
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
