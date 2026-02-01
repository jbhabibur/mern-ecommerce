import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/User.js";
import { hashPassword, generateOTP } from "../utils/auth.utils.js";
import {
  sendVerificationEmail,
  sendSuccessEmail,
} from "../services/email.service.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { sendTokens } from "../utils/token.utils.js";
import { sendResetPasswordEmail } from "../services/email.service.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // 1. Check existence
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already registered" });

  // 2. Prep data using utilities
  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // High-security verification token generation
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // 3. Database operation
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    otp,
    otpExpires,
    verificationToken, // Save this in your User Model
  });

  // 4. Construct URL for the email
  // In production, use your actual domain instead of localhost
  const verificationUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/account/verify-otp?token=${verificationToken}&email=${newUser.email}`;

  // 5. Send Email with Link
  sendVerificationEmail({
    email: newUser.email,
    otp: otp,
    name: newUser.firstName,
    verificationUrl: verificationUrl, // Pass this to your mail service
  });

  res.status(201).json({
    success: true,
    message:
      "Registration successful! Please click the link in your email to verify.",
  });
});

/**
 * @desc    Verify user email using OTP code
 * @route   POST /api/auth/verify-otp
 */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // 1. DATABASE LOOKUP: Find the user by email
    const user = await User.findOne({ email });

    // 2. EXISTENCE CHECK: Verify if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. VERIFICATION CHECK: Prevent re-verifying an already active account
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified. Please login.",
      });
    }

    // 4. OTP MATCH: Compare submitted OTP with stored OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code. Please try again.",
      });
    }

    // 5. EXPIRY CHECK: Ensure current time hasn't passed otpExpires
    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // 6. UPDATE USER STATUS
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // 7. SEND SUCCESS EMAIL (Isolated try-catch)
    try {
      await sendSuccessEmail({
        email: user.email,
        name: user.firstName,
      });
    } catch (emailError) {
      console.error("Success Email Error:", emailError.message);
      // We don't return an error here because the user is already verified in DB
    }

    // 8. FINAL RESPONSE
    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    // 9. GLOBAL ERROR CATCH
    console.error("OTP Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc    Resend OTP to user's email
 * @route   POST /api/auth/resend-otp
 */
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. DATABASE LOOKUP
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email.",
    });
  }

  // 2. VERIFICATION CHECK
  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "This account is already verified.",
    });
  }

  // 3. GENERATE NEW OTP (Clean way)
  const newOtp = generateOTP();
  const newOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // 4. UPDATE USER
  user.otp = newOtp;
  user.otpExpires = newOtpExpires;
  await user.save();

  // 5. SEND EMAIL (Background task - No 'await' to keep response fast)
  sendVerificationEmail({
    email: user.email,
    otp: newOtp,
    name: user.firstName,
  });

  // 6. SUCCESS RESPONSE
  res.status(200).json({
    success: true,
    message: "A new OTP has been sent to your email.",
  });
});

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check User
  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });

  // 2. Check Password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });

  // 3. Generate Tokens & Set Cookie
  const accessToken = sendTokens(user, res);

  res.status(200).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

/**
 * @desc    Forgot Password - Send reset link to email
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Find User
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "No account with this email" });
  }

  // 2. Generate temporary reset token (plain text for email)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 3. Store hashed version of token in DB for security
  user.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 4. Set token expiry time (e.g., 15 minutes)
  user.forgotPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  // 5. Construct reset URL for Frontend

  const resetUrl = `${process.env.CLIENT_URL}/account/reset-password/${resetToken}`;

  try {
    // 6. Send Email using the service layer
    await sendResetPasswordEmail({
      email: user.email,
      name: user.firstName,
      resetUrl,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    // 7. Cleanup on email failure
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpires = undefined;
    await user.save();
    return res
      .status(500)
      .json({ success: false, message: "Email could not be sent" });
  }
});

/**
 * @desc    Reset Password using token
 * @route   POST /api/auth/reset-password/:token
 */
export const resetPassword = asyncHandler(async (req, res) => {
  console.log("hello");

  // 1. Hash the token received from the URL to match the DB version
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2. Find user with valid token and not expired
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired reset token" });
  }

  // 3. Set new hashed password
  user.password = await hashPassword(req.body.password);

  // 4. Clear reset token fields
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful! You can now log in.",
  });
});
