import { Checkout } from "../models/checkout.model.js";
import crypto from "crypto";
import { asyncHandler } from "../middleware/error.middleware.js";

// @desc    Create a new checkout session
// @route   POST /api/checkout
// @access  Public
export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  const { items, totalAmount } = req.body;

  // Validation: Ensure items array is not empty
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error(
      "Your cart is empty. Please add items to checkout.",
    );
    error.status = 400;
    return next(error);
  }

  try {
    // Generate a secure unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Create the record in Database
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

// @desc    Get Checkout Session by Token
// @route   GET /api/checkout/:token
// @access  Public
export const getCheckoutByToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  // Populate product details (name, images, etc.) to display on checkout page
  const checkout = await Checkout.findOne({ token }).populate(
    "items.productId",
    "name price images category", // Only fetch necessary fields
  );

  // Check if session exists
  if (!checkout) {
    const error = new Error(
      "Checkout session not found or has already expired",
    );
    error.status = 404;
    return next(error);
  }

  // Check Expiry (Manual check in case MongoDB TTL hasn't run yet)
  if (new Date() > new Date(checkout.expiresAt)) {
    const error = new Error(
      "This checkout session has expired. Please restart.",
    );
    error.status = 410;
    return next(error);
  }

  // Check if already processed
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

// @desc    Complete Checkout
// @route   PUT /api/checkout/:token/complete
// @access  Public
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

  // Here you can add additional logic, like sending confirmation emails, updating inventory, etc.
  res.status(200).json({
    success: true,
    message: "Thank you! Your order has been placed successfully.",
    data: checkout,
  });
});
