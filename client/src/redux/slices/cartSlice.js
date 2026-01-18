import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // এখানে কার্টের সব প্রোডাক্ট থাকবে
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ১. প্রোডাক্ট অ্যাড করা
    addToCart: (state, action) => {
      const { id, size, price, name, image } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, size, price, name, image, quantity: 1 });
      }
    },

    // ২. কোয়ান্টিটি বাড়ানো বা কমানো
    updateQuantity: (state, action) => {
      const { id, size, type } = action.payload; // type: 'inc' অথবা 'dec'
      const item = state.items.find(
        (item) => item.id === id && item.size === size,
      );

      if (item) {
        if (type === "inc") {
          item.quantity += 1;
        } else if (type === "dec" && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
    },

    // ৩. কার্ট থেকে রিমুভ করা
    removeItem: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size),
      );
    },
  },
});

export const { addToCart, updateQuantity, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
