import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerService, loginService } from '../services/authService';

// Thunks
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerService(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error en el registro'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginService(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error en el login'
      );
    }
  }
);

// Estado inicial desde localStorage
const userFromStorage = JSON.parse(localStorage.getItem('user')) || null;

const initialState = {
  currentUser: userFromStorage,
  isAuthenticated: !!userFromStorage,
  users: [],
  status: 'idle',
  loginStatus: 'idle',
  registerStatus: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.loginStatus = 'idle';
      state.registerStatus = 'idle';
      state.error = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.loginStatus = 'idle';
      state.registerStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = 'succeeded';
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed';
        state.error = action.payload || 'Error en el registro';
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload;

        // Validar payload
        if (!payload || !payload.username) {
          state.loginStatus = 'failed';
          state.isAuthenticated = false;
          state.currentUser = null;
          state.error = payload?.message || 'Credenciales incorrectas';
          return;
        }

        state.loginStatus = 'succeeded';
        state.currentUser = {
          username: payload.username,
          roles: payload.roles
        };
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem('user', JSON.stringify(state.currentUser));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'failed';
        state.error = action.payload || 'Error en el login';
        state.isAuthenticated = false;
        state.currentUser = null;
      });
  }
});

export const { logout, clearError, resetStatus } = userSlice.actions;
export default userSlice.reducer;
