'use client';

import { createSlice } from '@reduxjs/toolkit';

type AuthUser = { id: string; name: string; email?: string; phone?: string; avatar?: string; role?: 'user' | 'admin' };

type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

const loadState = (): AuthState => {
  if (typeof window === 'undefined') return { user: null, token: null };
  const t = localStorage.getItem('token');
  const u = localStorage.getItem('user');
  return { token: t, user: u ? JSON.parse(u) : null };
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: { payload: { user: AuthUser; token: string } }) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    updateUser(state, action: { payload: AuthUser }) {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        const u = localStorage.getItem('user');
        if (u) {
          const parsed = JSON.parse(u) as AuthUser;
          localStorage.setItem('user', JSON.stringify({ ...parsed, ...action.payload }));
        }
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setAuth, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
