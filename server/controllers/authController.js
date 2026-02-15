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
  const { firstName, lastName, email, password, isSubscribed } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    // 1. User exists and is already verified (Return direct error)
    if (userExists.isVerified) {
      return res.status(409).json({
        message: "This email is already registered and verified. Please login.",
      });
    }

    // 2. User exists but is not verified (Don't resend OTP here, just send a flag)
    return res.status(403).json({
      success: false,
      unverified: true, // This flag allows the frontend to show a "Verify Now" button
      email: userExists.email,
      message: "This account exists but is not verified yet.",
    });
  }

  // 3. New user flow (Save user and send initial verification email)
  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
    verificationToken,
    verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000), // Magic link valid for 10 minutes
    isSubscribed,
    isVerified: false,
  });

  // Point the URL to your API route
  const verificationUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/verify-magic-link?email=${newUser.email}&token=${verificationToken}`;

  sendVerificationEmail({
    email: newUser.email,
    otp: otp,
    name: newUser.firstName,
    verificationUrl: verificationUrl,
  });

  res.status(201).json({
    success: true,
    message:
      "Registration successful! Please check your email to verify your account.",
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
      return res.status(409).json({
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
      return res.status(410).json({
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
 * @desc    Resend OTP and Magic Link to user's email
 * @route   POST /api/auth//resend-verification
 */
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("Resend verification called with:", email);

  // 1. DATABASE LOOKUP
  // Check if the user exists in the system
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found with this email.",
    });
  }

  // 2. VERIFICATION CHECK
  // If user is already verified, no need to send anything
  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "This account is already verified. Please login.",
    });
  }

  // 3. GENERATE NEW OTP & MAGIC TOKEN
  // Consistency: Using the same logic as your registerUser function
  const newOtp = generateOTP();
  const newVerificationToken = crypto.randomBytes(32).toString("hex");

  // Set expiration (matching your 10-minute registration window)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 4. UPDATE USER RECORD
  user.otp = newOtp;
  user.otpExpires = expiresAt;
  user.verificationToken = newVerificationToken;
  user.verificationTokenExpires = expiresAt;

  await user.save();

  // 5. CONSTRUCT MAGIC LINK URL
  // Matches the URL structure used in the registration flow
  const verificationUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/verify-magic-link?email=${user.email}&token=${newVerificationToken}`;

  // 6. SEND EMAIL (Background task)
  // Ensure your email helper can handle both 'otp' and 'verificationUrl'
  sendVerificationEmail({
    email: user.email,
    otp: newOtp,
    name: user.firstName,
    verificationUrl: verificationUrl,
  });

  // 7. SUCCESS RESPONSE
  res.status(200).json({
    success: true,
    message: "A new verification link and OTP have been sent to your email.",
  });
});

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validation check
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // 2. Check if user exists (Explicitly select password)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // 3. Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // 4. Check verification status
  if (!user.isVerified) {
    return res.status(403).json({
      // Changed to 403 Forbidden
      success: false,
      unverified: true,
      email: user.email,
      message: "Your account is not verified. Please verify your email.",
    });
  }

  // 5. Generate Tokens
  // NOTE: Ensure sendTokens returns the token string and does NOT
  // call res.send() or res.json() inside it.
  const accessToken = sendTokens(user, res);

  // 6. Final Response (Return to stop execution)
  return res.status(200).json({
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
 * @desc    Logout user & clear refresh token cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // 1. Clear the refreshToken cookie from the browser
  // The options must match the ones used when the cookie was originally set
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Enable secure in production (HTTPS)
    sameSite: "none", // Required for cross-site cookie handling
    path: "/", // Ensures the cookie is removed from the entire domain scope
  });

  // 2. Additional cleanup (If you store refresh tokens in the Database)
  // If you use a database to track sessions, find the user and set their
  // refreshToken field to null here before sending the response.

  // 3. Final Success Response
  // HTTP 200 OK is the industry standard for a successful logout
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
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
      .status(410)
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

/**
 * @desc    Verify magic link from email and redirect to a success confirmation page
 * @route   GET /api/auth/verify-magic-link
 */
export const verifyMagicLink = asyncHandler(async (req, res) => {
  const { email, token } = req.query;

  // DATABASE LOOKUP: Find user by email and matching verification token
  const user = await User.findOne({
    email,
    verificationToken: token,
  });

  // VALIDATION: Redirect to login with error if user not found or already verified
  if (!user || user.isVerified) {
    return res.redirect(
      `${process.env.CLIENT_URL}/account/login?error=invalid-link`,
    );
  }

  // EXPIRY CHECK: Ensure the magic link hasn't expired
  if (
    user.verificationTokenExpires &&
    new Date() > user.verificationTokenExpires
  ) {
    return res.redirect(
      `${process.env.CLIENT_URL}/account/login?error=link-expired`,
    );
  }

  // UPDATE STATUS: Mark user as verified and clear all temporary security tokens
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  // PROFESSIONAL REDIRECT:
  // Instead of direct login, send them to a success page.
  // This page on your frontend will show the "Success" message for 3-5 seconds.
  res.redirect(`${process.env.CLIENT_URL}/account/verify-success`);
});
