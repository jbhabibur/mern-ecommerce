import { createSlice } from "@reduxjs/toolkit";

/**
 * Helper function to retrieve and validate the cart state from local storage.
 * Handles SSR environments (Node.js) and malformed JSON data.
 */
const getInitialCart = () => {
  // Check for window to prevent errors during Server-Side Rendering (SSR)
  if (typeof window === "undefined")
    return { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };

  const savedCart = localStorage.getItem("cartData");
  try {
    return savedCart
      ? JSON.parse(savedCart)
      : { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };
  } catch (e) {
    // If stored JSON is corrupt, return the default empty state
    return { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialCart(),
  reducers: {
    /**
     * Toggles the cart drawer/modal visibility.
     * @param {boolean} action.payload - The desired open state.
     */
    setCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },

    /**
     * Adds a product to the cart or increments its quantity if it exists.
     * Uniqueness is determined by a combination of ID and Size.
     */
    addToCart(state, action) {
      const newItem = action.payload;
      const normalizedSize = newItem.size || "N/A";

      // Match by BOTH ID and Size to allow different variants of the same product
      const existingItem = state.items.find(
        (item) => item.id === newItem.id && item.size === normalizedSize,
      );

      const addedQuantity = Number(newItem.quantity) || 1;

      if (!existingItem) {
        state.items.push({
          ...newItem,
          size: normalizedSize,
          quantity: addedQuantity,
          totalPrice: newItem.price * addedQuantity,
        });
      } else {
        existingItem.quantity += addedQuantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      }

      // Recalculate global totals
      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      // Persist updated state to localStorage
      localStorage.setItem("cartData", JSON.stringify(state));
    },

    /**
     * Adjusts the quantity of an item already in the cart.
     * @param {string} action.payload.type - Either 'increment' or 'decrement'.
     */
    updateQuantity(state, action) {
      const { id, size, type } = action.payload;
      const item = state.items.find((i) => i.id === id && i.size === size);

      if (item) {
        if (type === "increment") {
          item.quantity++;
        } else if (type === "decrement" && item.quantity > 1) {
          item.quantity--;
        }
        item.totalPrice = item.quantity * item.price;
      }

      // Recalculate global totals
      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      localStorage.setItem("cartData", JSON.stringify(state));
    },

    /**
     * Completely removes a specific product variant from the cart.
     */
    removeFromCart(state, action) {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size),
      );

      // Recalculate global totals
      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      localStorage.setItem("cartData", JSON.stringify(state));
    },

    /**
     * Resets the cart to its empty state.
     * Useful for timer expiration or after a successful checkout.
     */
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.isCartOpen = false;

      // Update localStorage so it stays empty after refresh
      localStorage.setItem("cartData", JSON.stringify(state));
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
