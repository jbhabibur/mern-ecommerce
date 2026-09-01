import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
  getAllStaff,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { restrictTo } from "../middleware/restrictTo.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/user.validator.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/profile/
// @access  Private (Authenticated Users)
router.get("/", verifyToken, getProfile);

// @desc    Get all users except customers (Admin/Staff only)
// @route   GET /api/profile/all-staff
// @access  Private (Super Admin, Manager, Editor)
router.get(
  "/all-staff",
  verifyToken,
  restrictTo("super-admin", "manager", "editor"),
  getAllStaff,
);

// @desc    Update profile details (Name, Phone, etc.)
// @route   PATCH /api/profile/update-profile
// @access  Private (Authenticated Users)
router.patch(
  "/update-profile",
  verifyToken,
  validate(updateProfileSchema),
  updateProfile,
);

// @desc    Change user password
// @route   PATCH /api/profile/change-password
// @access  Private (Authenticated Users)
router.patch(
  "/change-password",
  verifyToken,
  validate(changePasswordSchema),
  changePassword,
);

// @desc    Update profile picture (Uploads to Cloudinary)
// @route   PATCH /api/profile/update-image
// @access  Private (Authenticated Users)
router.patch(
  "/update-image",
  upload.single("image"),
  verifyToken,
  updateProfileImage,
);

// @desc    Update user role (Super Admin only)
// @route   PATCH /api/profile/update-role/:id
// @access  Private (Super Admin Only)
router.patch(
  "/update-role/:id",
  verifyToken,
  restrictTo("super-admin"),
  updateUserRole,
);

// @desc    Permanently delete a user account (Super Admin only)
// @route   DELETE /api/profile/delete-user/:id
// @access  Private (Super Admin Only)
router.delete(
  "/delete-user/:id",
  verifyToken,
  restrictTo("super-admin"),
  deleteUser,
);

export default router;
