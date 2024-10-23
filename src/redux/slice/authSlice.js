import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  loaded: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loaded = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loaded = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFail: (state, action) => {
      state.loaded = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.loaded = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    failedToSetUser: (state, action) => {
      state.loaded = false;
      state.error = action.payload;
    }
  }
});

// Export actions
export const {
  loginRequest,
  loginSuccess,
  loginFail,
  logout,
  setUser,
  failedToSetUser
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
