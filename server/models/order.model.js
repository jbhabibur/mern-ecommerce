import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 1. Customer Identification
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      email: { type: String, required: true },
      isGuest: { type: Boolean, default: false },
    },

    // 2. Product Snapshots (Critical for maintaining historical accuracy)
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        priceAtCheckout: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
        sku: { type: String },
      },
    ],

    // 3. Address Snapshots (Stores exact data at the time of order)
    shippingAddress: {
      fullName: String,
      phoneNumber: String,
      division: String,
      city: String,
      zone: String,
      houseAddress: String,
      label: String, // e.g., 'Home', 'Office'
    },
    billingAddress: {
      fullName: String,
      phoneNumber: String,
      division: String,
      city: String,
      zone: String,
      houseAddress: String,
    },

    // 4. Financial Breakdown
    financials: {
      subtotal: { type: Number, required: true },
      shippingFee: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      couponCode: { type: String, default: null },
    },

    // 5. Payment Details (Optimized for SSLCommerz)
    payment: {
      method: { type: String, required: true }, // 'ssl' or 'cod'
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "cancelled", "refunded"],
        default: "pending",
      },
      transactionId: { type: String, required: true, unique: true },
      val_id: { type: String },
      bankTranId: { type: String },
      cardType: { type: String },
      paymentDate: { type: Date },
    },

    // 6. Logistics & Tracking
    orderStatus: {
      type: String,
      enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Order Placed",
    },
    courierDetails: {
      courierName: String,
      trackingId: String,
      estimatedDelivery: Date,
    },

    // 7. Status History (Audit Trail using ES6 Date defaults)
    history: [
      {
        status: String,
        updatedAt: { type: Date, default: () => Date.now() },
        updatedBy: { type: String, default: "system" },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Optimize search performance for Admin Dashboard and Customer Profiles
orderSchema.index({ "customer.email": 1, "payment.transactionId": 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
