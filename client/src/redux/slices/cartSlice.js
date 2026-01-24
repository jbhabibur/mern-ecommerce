import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  if (typeof window === "undefined")
    return { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };

  const savedCart = localStorage.getItem("cartData");
  try {
    return savedCart
      ? JSON.parse(savedCart)
      : { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };
  } catch (e) {
    return { items: [], totalAmount: 0, totalQuantity: 0, isCartOpen: false };
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialCart(),
  reducers: {
    setCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
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

      // Update Global Totals
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

    removeFromCart(state, action) {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.size === size),
      );

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
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
