import express from "express";
import {
  createCheckoutSession,
  getCheckoutByToken,
  completeCheckout,
} from "../controllers/checkout.controller.js";
import { optionalAuth } from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

// 1. Checkout session initiate korar jonno
// Path: POST /api/checkouts/initiate
router.post("/initiate", optionalAuth, createCheckoutSession);

// 2. Token diye checkout details anar jonno
// Path: GET /api/checkouts/cn/:token
router.get("/cn/:token", getCheckoutByToken);

// 3. Status update/complete korar jonno
// Path: PATCH /api/checkouts/complete/:token
router.patch("/complete/:token", completeCheckout);

export default router;
