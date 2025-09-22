import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../features/auth/slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
