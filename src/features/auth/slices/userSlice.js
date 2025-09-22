// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Acción asíncrona para registrar usuario
// export const registerUser = createAsyncThunk(
//   'user/registerUser',
//   async (userData, thunkAPI) => {
//     const response = await axios.post('http://localhost:8080/api/users', userData);
//     return response.data; // el usuario registrado que devuelve el backend
//   }
// );

// const initialState = {
//   users: [],
//   status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.users.push(action.payload);
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export default userSlice.reducer;
