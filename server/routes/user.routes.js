import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
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
export default router;
