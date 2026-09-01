import express from "express";
import {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

import { validate } from "../middleware/validate.middleware.js";
import { addressValidationSchema } from "../validators/address.validator.js";

const router = express.Router();

// @desc    Create a new shipping address
// @route   POST /api/address
// @access  Private (Authenticated Users)
router.post(
  "/",
  verifyToken,
  validate(addressValidationSchema.create),
  createAddress,
);

// @desc    Get all addresses for the authenticated user
// @route   GET /api/address
// @access  Private (Authenticated Users)
router.get("/", verifyToken, getAddresses);

// @desc    Update an existing address by ID
// @route   PUT /api/address/:id
// @access  Private (Authenticated Users)
router.put(
  "/:id",
  verifyToken,
  validate(addressValidationSchema.update),
  updateAddress,
);

// @desc    Delete an address by ID
// @route   DELETE /api/address/:id
// @access  Private (Authenticated Users)
router.delete("/:id", verifyToken, deleteAddress);

// @desc    Set a specific address as the default address
// @route   PATCH /api/address/default/:id
// @access  Private (Authenticated Users)
router.patch("/default/:id", verifyToken, setDefaultAddress);

export default router;
