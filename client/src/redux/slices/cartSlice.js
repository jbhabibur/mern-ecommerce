import { createSlice } from "@reduxjs/toolkit";

/**
 * Retrieves initial state from Local Storage.
 */
const getInitialCart = () => {
  if (typeof window === "undefined")
    return { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };

  const savedCart = localStorage.getItem("cartData");
  return savedCart
    ? JSON.parse(savedCart)
    : { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialCart(),
  reducers: {
    // --- কার্ট ওপেন/ক্লোজ করার লজিক ---
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen(state, action) {
      state.isCartOpen = action.payload; // true বা false পাঠানো যাবে
    },
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size,
      );

      const addedQuantity = newItem.quantity || 1;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          quantity: addedQuantity,
          size: newItem.size,
          image: newItem.image,
          totalPrice: newItem.price * addedQuantity,
        });
      } else {
        existingItem.quantity += addedQuantity;
        existingItem.totalPrice += newItem.price * addedQuantity;
      }

      state.totalQuantity += addedQuantity;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
      // ✅ SUCCESS: No localStorage call here. store.subscribe handles it!
    },

    updateQuantity(state, action) {
      const { id, size, type } = action.payload;
      const item = state.items.find((i) => i.id === id && i.size === size);

      if (item) {
        if (type === "increment") {
          item.quantity++;
          item.totalPrice += item.price;
          state.totalQuantity++;
        } else if (type === "decrement" && item.quantity > 1) {
          item.quantity--;
          item.totalPrice -= item.price;
          state.totalQuantity--;
        }
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
    },

    removeFromCart(state, action) {
      const { id, size } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size,
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter(
          (item) => !(item.id === id && item.size === size),
        );
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      // ✅ SUCCESS: store.subscribe will see this empty state and update localStorage.
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
