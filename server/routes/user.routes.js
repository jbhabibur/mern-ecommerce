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

/**
 * @route   GET /api/profile/
 * @desc    Get current user
 */
router.get("/", verifyToken, getProfile);

/**
 * @route   GET /api/profile/all-staff
 * @desc    Get all users except customers (Admin/Staff only)
 */
router.get(
  "/all-staff",
  verifyToken,
  restrictTo("super-admin", "manager", "editor"),
  getAllStaff,
);

/**
 * @route   PATCH /api/profile/update-profile
 * @desc    Update profile details (Name, Phone, etc.)
 */
router.patch(
  "/update-profile",
  verifyToken,
  validate(updateProfileSchema),
  updateProfile,
);

/**
 * @route   PATCH /api/profile/change-password
 * @desc    Change user password
 */
router.patch(
  "/change-password",
  verifyToken,
  validate(changePasswordSchema),
  changePassword,
);

/**
 * @route   PATCH /api/profile/update-image
 * @desc    Update profile picture (Uploads to Cloudinary)
 */
router.patch(
  "/update-image",
  upload.single("image"),
  verifyToken,
  updateProfileImage,
);

/**
 * @route   PATCH /api/profile/update-role/:id
 * @desc    Update user role (Super Admin only)
 */
router.patch(
  "/update-role/:id",
  verifyToken,
  restrictTo("super-admin"),
  updateUserRole,
);

/**
 * @route   DELETE /api/profile/delete-user/:id
 * @desc    Permanently delete a user account (Super Admin only)
 */
router.delete(
  "/delete-user/:id",
  verifyToken,
  restrictTo("super-admin"),
  deleteUser,
);

export default router;
