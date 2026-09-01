import express from "express";
import {
  paymentSuccess,
  paymentFail,
  paymentCancel,
} from "../controllers/payment.controller.js";

const router = express.Router();

// @desc    Handle successful payment callback from SSLCommerz gateway
// @route   POST /api/payment/success/:tranId
// @access  Public (Called by Payment Gateway Server-to-Server / Redirect)
router.post("/success/:tranId", paymentSuccess);

// @desc    Handle failed payment callback from SSLCommerz gateway
// @route   POST /api/payment/fail/:tranId
// @access  Public (Called by Payment Gateway Server-to-Server / Redirect)
router.post("/fail/:tranId", paymentFail);

// @desc    Handle cancelled payment callback from SSLCommerz gateway
// @route   POST /api/payment/cancel/:tranId
// @access  Public (Called by Payment Gateway Server-to-Server / Redirect)
router.post("/cancel/:tranId", paymentCancel);

export default router;
