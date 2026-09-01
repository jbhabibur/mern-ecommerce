import express from "express";
const router = express.Router();

import {
  registerUser,
  verifyOTP,
  resendVerification,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyMagicLink,
  firebaseAuth,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

// @desc    Register a new user & send OTP
// @route   POST /api/auth/register
// @access  Public (User must not be logged in)
router.post("/register", validate(registerSchema), registerUser);

// @desc    Firebase OAuth login/register
// @route   POST /api/auth/firebase-auth
// @access  Private (Needs verifyToken to get Firebase data)
router.post("/firebase-auth", verifyToken, firebaseAuth);

// @desc    Verify user email using OTP code
// @route   POST /api/auth/verify-otp
// @access  Public (User must have received OTP via email)
router.post("/verify-otp", verifyOTP);

// @desc    Resend OTP and Magic Link to user's email if expired or lost
// @route   POST /api/auth/resend-verification
// @access  Public (User must have registered but not verified)
router.post("/resend-verification", resendVerification);

// @desc    Logout user & clear refresh token cookie
// @route   POST /api/auth/logout
// @access  Private (User must be logged in)
router.post("/logout", verifyToken, logoutUser);

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public (User must have registered)
router.post("/login", validate(loginSchema), loginUser);

// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public (User must have registered)
router.post("/forgot-password", forgotPassword);

// @desc    Update new password
// @route   POST /api/auth/reset-password/:token
// @access  Public (User must have received password reset email)
router.post("/reset-password/:token", resetPassword);

// @desc    Verify user via email link (Must be GET as email links trigger GET requests)
// @route   GET /api/auth/verify-magic-link
// @access  Public (User must have received magic link via email)
router.get("/verify-magic-link", verifyMagicLink);

export default router;
