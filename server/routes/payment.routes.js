import express from "express";
import {
  paymentSuccess,
  paymentFail,
  paymentCancel,
} from "../controllers/payment.controller.js";

const router = express.Router();

// SSLCommerz will POST data to these URLs after the user interacts with their gateway
router.post("/success/:tranId", paymentSuccess);
router.post("/fail/:tranId", paymentFail);
router.post("/cancel/:tranId", paymentCancel);

export default router;
