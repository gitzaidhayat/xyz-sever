import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authApi.register(userData);
      // Backend uses httpOnly cookies, no need to store tokens
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      // Backend uses httpOnly cookies, no need to store tokens
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getCurrentUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load user');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authApi.updateProfile(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const data = await authApi.changePassword(passwordData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password change failed');
    }
  }
);

// Admin Auth Thunks
export const adminRegister = createAsyncThunk(
  'auth/adminRegister',
  async (partnerData, { rejectWithValue }) => {
    try {
      const data = await authApi.adminRegister(partnerData);
      // Backend uses httpOnly cookies, no need to store tokens
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Admin registration failed');
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.adminLogin(credentials);
      // Backend uses httpOnly cookies, no need to store tokens
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Admin login failed');
    }
  }
);

export const adminLogout = createAsyncThunk(
  'auth/adminLogout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.adminLogout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Helper functions for localStorage persistence
const loadAuthFromStorage = () => {
  try {
    const authData = localStorage.getItem('authState');
    if (authData) {
      const parsed = JSON.parse(authData);
      return {
        user: parsed.user,
        isAuthenticated: parsed.isAuthenticated,
        initialCheckComplete: true, // Mark as complete if we have data
      };
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
  }
  return null;
};

const saveAuthToStorage = (user, isAuthenticated) => {
  try {
    localStorage.setItem('authState', JSON.stringify({ user, isAuthenticated }));
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
};

const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem('authState');
  } catch (error) {
    console.error('Error clearing auth from storage:', error);
  }
};

const savedAuth = loadAuthFromStorage();

const initialState = {
  user: savedAuth?.user || null,
  isAuthenticated: savedAuth?.isAuthenticated || false,
  isLoading: false,
  initialCheckComplete: savedAuth?.initialCheckComplete || false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialCheckComplete = true;
        saveAuthToStorage(action.payload.user, true);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialCheckComplete = true;
        saveAuthToStorage(action.payload.user, true);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      });

    // Load User
    builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialCheckComplete = true;
        saveAuthToStorage(action.payload.user, true);
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
        // Only clear auth if we don't have a user already (from login/register)
        // This prevents loadUser failures from logging out authenticated users
        if (!state.user && !state.isAuthenticated) {
          state.user = null;
          state.isAuthenticated = false;
          clearAuthFromStorage();
        }
        state.initialCheckComplete = true; // Mark as complete even if failed
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Admin Register
    builder
      .addCase(adminRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.admin || action.payload.user || action.payload.partner;
        state.isAuthenticated = true;
        state.initialCheckComplete = true;
        saveAuthToStorage(state.user, true);
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Admin Login
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.admin || action.payload.user || action.payload.partner;
        state.isAuthenticated = true;
        state.initialCheckComplete = true;
        saveAuthToStorage(state.user, true);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Admin Logout
    builder
      .addCase(adminLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      })
      .addCase(adminLogout.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
