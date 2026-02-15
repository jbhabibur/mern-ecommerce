import express from "express";
const router = express.Router();

import {
  registerUser,
  verifyOTP,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyMagicLink,
} from "../controllers/authController.js";

import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

// @route   POST /api/auth/register
// @desc    Register a new user & send OTP
router.post("/register", validate(registerSchema), registerUser);

// @route   POST /api/auth/verify-otp
// @desc    Verify user email using OTP code
router.post("/verify-otp", verifyOTP);

// @route   POST /api/auth/resend-verification
// @desc    Resend OTP and Magic Link to user's email if expired or lost
router.post("/resend-verification", resendVerification);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & clear refresh token cookie
 */
router.post("/login", validate(loginSchema), loginUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", validate(loginSchema), loginUser);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Update new password
router.post("/reset-password/:token", resetPassword);

// @route   GET /api/auth/verify-magic-link
// @desc    Verify user via email link (Must be GET as email links trigger GET requests)
router.get("/verify-magic-link", verifyMagicLink);

export default router;
