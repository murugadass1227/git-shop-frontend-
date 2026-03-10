'use client';

import { createSlice } from '@reduxjs/toolkit';

export type WishlistItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
};

type WishlistState = {
  items: WishlistItem[];
};

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist(_, action: { payload: { items: WishlistItem[] } }) {
      return { items: action.payload.items || [] };
    },
    addToWishlist(state, action: { payload: WishlistItem }) {
      if (state.items.some((i) => i.id === action.payload.id)) return;
      state.items.push(action.payload);
    },
    removeFromWishlist(state, action: { payload: string }) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    toggleWishlist(state, action: { payload: WishlistItem }) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearWishlist() {
      return { items: [] };
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
