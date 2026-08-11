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

// @route   POST /api/auth/register
// @desc    Register a new user & send OTP
// @access  Public (User must not be logged in)
router.post("/register", validate(registerSchema), registerUser);

// @route   POST /api/auth/firebase-auth
// @desc    Firebase OAuth login/register
// @access  Private (Needs verifyToken to get Firebase data)
router.post("/firebase-auth", verifyToken, firebaseAuth);

// @route   POST /api/auth/verify-otp
// @desc    Verify user email using OTP code
// @access  Public (User must have received OTP via email)
router.post("/verify-otp", verifyOTP);

// @route   POST /api/auth/resend-verification
// @desc    Resend OTP and Magic Link to user's email if expired or lost
// @access  Public (User must have registered but not verified)
router.post("/resend-verification", resendVerification);

// @route   POST /api/auth/logout
// @desc    Logout user & clear refresh token cookie
// @access  Private (User must be logged in)
router.post("/logout", verifyToken, logoutUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public (User must have registered)
router.post("/login", validate(loginSchema), loginUser);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public (User must have registered)
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Update new password
// @access  Public (User must have received password reset email)
router.post("/reset-password/:token", resetPassword);

// @route   GET /api/auth/verify-magic-link
// @desc    Verify user via email link (Must be GET as email links trigger GET requests)
// @access  Public (User must have received magic link via email)
router.get("/verify-magic-link", verifyMagicLink);

export default router;
