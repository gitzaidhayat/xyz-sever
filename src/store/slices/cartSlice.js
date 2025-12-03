import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';

// Helper functions for local storage
const loadCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [], totalItems: 0, subtotal: 0, discount: 0, total: 0, coupon: null };
  } catch (error) {
    return { items: [], totalItems: 0, subtotal: 0, discount: 0, total: 0, coupon: null };
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

const calculateCartTotals = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, total, totalItems };
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      // Try to fetch from API first
      const data = await cartApi.getCart();
      return data;
    } catch (error) {
      // If API fails, load from local storage
      return loadCartFromStorage();
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, variant, product }, { getState, rejectWithValue }) => {
    try {
      // Try API first
      const data = await cartApi.addToCart(productId, quantity, variant);
      return data;
    } catch (error) {
      // Fallback to local cart
      const state = getState().cart;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === productId && item.variant === variant
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem = {
          _id: `${productId}_${variant}_${Date.now()}`,
          productId,
          variant,
          quantity,
          price: product?.price || 0,
          name: product?.name || product?.title || 'Product',
          image: product?.images?.[0] || '',
        };
        newItems = [...state.items, newItem];
      }

      const totals = calculateCartTotals(newItems, state.discount);
      const cartData = {
        items: newItems,
        ...totals,
        discount: state.discount,
        coupon: state.coupon,
      };
      
      saveCartToStorage(cartData);
      return cartData;
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { getState, rejectWithValue }) => {
    try {
      const data = await cartApi.updateCartItem(itemId, quantity);
      return data;
    } catch (error) {
      // Fallback to local cart
      const state = getState().cart;
      const newItems = state.items.map(item => 
        item._id === itemId ? { ...item, quantity } : item
      );
      
      const totals = calculateCartTotals(newItems, state.discount);
      const cartData = {
        items: newItems,
        ...totals,
        discount: state.discount,
        coupon: state.coupon,
      };
      
      saveCartToStorage(cartData);
      return cartData;
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const data = await cartApi.removeFromCart(itemId);
      return data;
    } catch (error) {
      // Fallback to local cart
      const state = getState().cart;
      const newItems = state.items.filter(item => item._id !== itemId);
      
      const totals = calculateCartTotals(newItems, state.discount);
      const cartData = {
        items: newItems,
        ...totals,
        discount: state.discount,
        coupon: state.coupon,
      };
      
      saveCartToStorage(cartData);
      return cartData;
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartApi.clearCart();
      return data;
    } catch (error) {
      // Fallback to local cart
      const emptyCart = {
        items: [],
        totalItems: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        coupon: null,
      };
      
      saveCartToStorage(emptyCart);
      return emptyCart;
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const data = await cartApi.applyCoupon(code);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply coupon');
    }
  }
);

export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartApi.removeCoupon();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove coupon');
    }
  }
);

const initialState = {
  ...loadCartFromStorage(),
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
        state.coupon = action.payload.coupon || null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Add to Cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Remove from Cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.subtotal = action.payload.subtotal || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Clear Cart
    builder
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.subtotal = 0;
        state.discount = 0;
        state.total = 0;
        state.coupon = null;
      });

    // Apply Coupon
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discount = action.payload.discount || 0;
        state.total = action.payload.total || 0;
        state.coupon = action.payload.coupon || null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Remove Coupon
    builder
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.discount = 0;
        state.total = action.payload.total || state.subtotal;
        state.coupon = null;
      });
  },
});

export const { clearError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
