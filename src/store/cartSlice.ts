'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { CartItem } from '@/lib/api';

type CartState = {
  items: CartItem[];
  count: number;
};

const initialState: CartState = { items: [], count: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(_, action: { payload: { items: CartItem[] } }) {
      const items = action.payload.items || [];
      const count = items.reduce((s, i) => s + i.quantity, 0);
      return { items, count };
    },
    clearCart() {
      return { items: [], count: 0 };
    },
    addToCart(state, action: { payload: CartItem }) {
      const existingItem = state.items.find(item => item.productId._id === action.payload.productId._id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.count = state.items.reduce((s, i) => s + i.quantity, 0);
    },
    removeFromCart(state, action: { payload: string }) {
      state.items = state.items.filter(item => item.productId._id !== action.payload);
      state.count = state.items.reduce((s, i) => s + i.quantity, 0);
    },
    updateQuantity(state, action: { payload: { id: string; quantity: number } }) {
      const item = state.items.find(item => item.productId._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.count = state.items.reduce((s, i) => s + i.quantity, 0);
    },
  },
});

export const { setCart, clearCart, addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
