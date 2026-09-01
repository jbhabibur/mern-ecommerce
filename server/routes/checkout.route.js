import express from "express";
import {
  createCheckoutSession,
  getCheckoutByToken,
  completeCheckout,
} from "../controllers/checkout.controller.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

// @desc    Initiate a new checkout session (Supports both guest and authenticated users)
// @route   POST /api/checkouts/initiate
// @access  Public / Private (Optional Auth)
router.post("/initiate", optionalAuth, createCheckoutSession);

// @desc    Get checkout session details by secure token
// @route   GET /api/checkouts/cn/:token
// @access  Public
router.get("/cn/:token", getCheckoutByToken);

// @desc    Complete or update the checkout session status using token
// @route   PATCH /api/checkouts/complete/:token
// @access  Public
router.patch("/complete/:token", completeCheckout);

export default router;
