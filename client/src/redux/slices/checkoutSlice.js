import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 1. Customer Identification
  customer: {
    userId: null,
    email: "",
    isGuest: true,
  },
  // 2. Product Snapshots
  items: [],
  // 3. Address Snapshots
  shippingAddress: {
    fullName: "",
    phoneNumber: "",
    division: "",
    city: "",
    zone: "",
    houseAddress: "",
    label: "Home",
  },
  billingAddress: {
    fullName: "",
    phoneNumber: "",
    division: "",
    city: "",
    zone: "",
    houseAddress: "",
  },
  // 4. Financial Breakdown
  financials: {
    subtotal: 0,
    shippingFee: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    couponCode: null,
  },
  // 5. Payment Details
  payment: {
    method: "ssl", // default
    status: "pending",
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Sync products and calculations from Order Summary
    syncCheckoutData: (state, action) => {
      const { items, totalAmount } = action.payload;
      const tax = Math.round(totalAmount * 0.05); // Example: 5% VAT calculation

      state.items = items;
      state.financials.totalAmount = totalAmount;
      state.financials.taxAmount = tax;
      state.financials.subtotal = totalAmount - tax;
    },
    // Update customer profile information
    setCustomerInfo: (state, action) => {
      state.customer = { ...state.customer, ...action.payload };
    },
    // Update shipping address details
    updateShippingAddress: (state, action) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload };
    },
    // Update billing address details
    updateBillingAddress: (state, action) => {
      state.billingAddress = { ...state.billingAddress, ...action.payload };
    },
    // Change the selected payment method
    setPaymentMethod: (state, action) => {
      state.payment.method = action.payload;
    },
    // Reset checkout state to initial values
    resetCheckout: () => initialState,
  },
});

export const {
  syncCheckoutData,
  setCustomerInfo,
  updateShippingAddress,
  updateBillingAddress,
  setPaymentMethod,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
