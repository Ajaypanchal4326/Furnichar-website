import { createSlice } from "@reduxjs/toolkit";

const cartFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: cartFromStorage,
  },
  reducers: {
    addToCart(state, action) {
      const item = state.items.find(
        (i) => i._id === action.payload._id
      );

      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    // ✅ FIXED: updateQuantity
    updateQuantity(state, action) {
      const { _id, quantity } = action.payload;

      const item = state.items.find((i) => i._id === _id);

      if (item) {
        item.quantity = quantity;
      }

      // 🔥 IMPORTANT: sync with localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart(state, action) {
      state.items = state.items.filter(
        (i) => i._id !== action.payload
      );

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
