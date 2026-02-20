import mongoose from "mongoose";

/**
 * Checkout Schema
 * * Represents a temporary checkout session for a user or guest.
 * Includes a TTL (Time-To-Live) index to automatically remove
 * expired sessions from the database.
 */
const checkoutSchema = new mongoose.Schema(
  {
    /** Reference to the User; null if the user is checking out as a guest */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    /** Unique identifier for the checkout session (e.g., Stripe sessionId or UUID) */
    token: {
      type: String,
      required: true,
      unique: true,
    },
    /** List of products included in this checkout session */
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        /** Captures the product price at the moment of checkout to prevent price fluctuation issues */
        priceAtCheckout: {
          type: Number,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],
    /** Total cost of all items in the checkout */
    totalAmount: {
      type: Number,
      required: true,
    },
    /** Current state of the checkout process */
    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      default: "pending",
    },
    /** Expiration timestamp; defaults to 15 minutes from the time of creation */
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 mins TTL
    },
  },
  {
    /** Automatically creates 'createdAt' and 'updatedAt' fields */
    timestamps: true,
  },
);

/** * TTL Index: MongoDB will automatically delete the document
 * when the current time reaches the 'expiresAt' value.
 */
checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Checkout = mongoose.model("Checkout", checkoutSchema);
