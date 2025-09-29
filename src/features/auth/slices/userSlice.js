import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerService, loginService } from '../services/authService';

// Register Thunk
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerService(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Error en el registro'
      );
    }
  }
);

// login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginService(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Error en el login'
      );
    }
  }
);

const user = JSON.parse(localStorage.getItem('user')) || null;

const initialState = {
  currentUser: user,
  isAuthenticated: !!user,
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
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded';
        state.currentUser = {
          username: action.payload.username,
          roles: action.payload.roles
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
  },
});

export const { logout, clearError, resetStatus } = userSlice.actions;
export default userSlice.reducer;

// const token = localStorage.getItem('token');
// const user = token ? JSON.parse(localStorage.getItem('user')) : null;

// const initialState = {
//   currentUser: user || null,
//   isAuthenticated: !!token,
//   users: [],
//   status: 'idle',
//   loginStatus: 'idle',
//   registerStatus: 'idle',
//   error: null,
//   token: token || null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.currentUser = null;
//       state.isAuthenticated = false;
//       state.token = null;
//       state.status = 'idle';
//       state.loginStatus = 'idle';
//       state.registerStatus = 'idle';
//       state.error = null;

//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     resetStatus: (state) => {
//       state.status = 'idle';
//       state.loginStatus = 'idle';
//       state.registerStatus = 'idle';
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.registerStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.registerStatus = 'succeeded';
//         state.users.push(action.payload);
//         state.error = null;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.registerStatus = 'failed';
//         state.error = action.payload || 'Error en el registro';
//       })
//       // Login
//       .addCase(loginUser.pending, (state) => {
//         state.loginStatus = 'loading';
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loginStatus = 'succeeded';
//         state.currentUser = action.payload.user || action.payload; // por si el backend devuelve user
//         state.isAuthenticated = true;
//         state.token = action.payload.token || null;
//         state.error = null;

//         // Save token
//         if (action.payload.token) {
//           localStorage.setItem('token', action.payload.token);
//           localStorage.setItem('user', JSON.stringify(state.currentUser));
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loginStatus = 'failed';
//         state.error = action.payload || 'Error en el login';
//         state.isAuthenticated = false;
//         state.currentUser = null;
//         state.token = null;
//       });
//   },
// });

// export const { logout, clearError, resetStatus } = userSlice.actions;
// export default userSlice.reducer;
