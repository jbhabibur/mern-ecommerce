import express from "express";
const router = express.Router();

import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

// @route   POST /api/auth/register
// @desc    Register a new user & send OTP
router.post("/register", validate(registerSchema), registerUser);

// @route   POST /api/auth/verify-otp
// @desc    Verify user email using OTP code
router.post("/verify-otp", verifyOTP);

// @route   POST /api/auth/resend-otp
// @desc    Resend a new OTP if expired
router.post("/resend-otp", resendOTP);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", validate(loginSchema), loginUser);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
router.post("/forgot-password", forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Update new password
router.post("/reset-password/:token", resetPassword);

export default router;
