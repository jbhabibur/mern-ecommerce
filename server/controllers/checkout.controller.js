import { Checkout } from "../models/checkout.model.js";
import crypto from "crypto";
import { asyncHandler } from "../middleware/error.middleware.js";

/**
 * 1. Create Checkout Session
 * Handles the initiation of a checkout process.
 */

export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  // Destructure AFTER logging req.body
  const { items, totalAmount } = req.body;

  // 1. Validation: Ensure items array is not empty
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error(
      "Your cart is empty. Please add items to checkout.",
    );
    error.status = 400;
    return next(error);
  }

  try {
    // 2. Generate a secure unique token
    const token = crypto.randomBytes(32).toString("hex");

    // 3. Create the record in Database
    const newCheckout = await Checkout.create({
      userId: req.user?._id || null,
      token,
      items,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      message: "Checkout session initiated successfully",
      data: {
        token: newCheckout.token,
        expiresAt: newCheckout.expiresAt,
        checkoutUrl: `/checkouts/cn/${newCheckout.token}`,
      },
    });
  } catch (dbError) {
    console.error(">>> [DATABASE ERROR]:", dbError.message);
    return next(dbError);
  }
});

/**
 * 2. Get Checkout Details by Token
 * Retrieves session data when the user lands on /checkouts/cn/:token
 */
export const getCheckoutByToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  // Populate product details (name, images, etc.) to display on checkout page
  const checkout = await Checkout.findOne({ token }).populate(
    "items.productId",
    "name price images category", // Only fetch necessary fields
  );

  // 1. Check if session exists
  if (!checkout) {
    const error = new Error(
      "Checkout session not found or has already expired",
    );
    error.status = 404;
    return next(error);
  }

  // 2. Check Expiry (Manual check in case MongoDB TTL hasn't run yet)
  if (new Date() > new Date(checkout.expiresAt)) {
    const error = new Error(
      "This checkout session has expired. Please restart.",
    );
    error.status = 410; // Gone
    return next(error);
  }

  // 3. Check if already processed
  if (checkout.status === "completed") {
    const error = new Error("This order has already been completed.");
    error.status = 400;
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: checkout,
  });
});

/**
 * 3. Update Status to Completed
 * Finalizes the checkout after payment/form submission.
 */
export const completeCheckout = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  // Atomically find and update to prevent race conditions
  const checkout = await Checkout.findOneAndUpdate(
    { token, status: "pending" },
    { status: "completed" },
    { new: true },
  );

  if (!checkout) {
    const error = new Error(
      "Checkout session is invalid or already processed.",
    );
    error.status = 400;
    return next(error);
  }

  /**
   * INDUSTRY STANDARD NEXT STEPS:
   * 1. Create a permanent 'Order' document using this checkout data.
   * 2. Reduce stock levels in the 'Products' collection.
   * 3. Send a confirmation email to the user.
   */

  res.status(200).json({
    success: true,
    message: "Thank you! Your order has been placed successfully.",
    data: checkout,
  });
});
