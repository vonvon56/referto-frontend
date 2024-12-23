import { createSlice } from '@reduxjs/toolkit';
import { getCookie } from '../utils/cookie';

const initialState = {
  isLoggedIn: !!getCookie('access_token'),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
      console.log('[Redux] Login action dispatched, new state:', state);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      console.log('[Redux] Logout action dispatched, new state:', state);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      console.log('[Redux] SetUser action dispatched, new state:', state);
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
