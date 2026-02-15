import express from "express";
import {
  createAddress,
  getAddresses,
  updateAddress, // Added
  deleteAddress, // Added
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";

import { validate } from "../middleware/validate.middleware.js";
import { addressValidationSchema } from "../validators/address.validator.js";

const router = express.Router();

// POST: /api/address
// sequence: verifyToken (Check Auth) -> createAddress (Save to DB)
router.post(
  "/",
  verifyToken,
  validate(addressValidationSchema.create),
  createAddress,
);

// GET: /api/address
// sequence: verifyToken (Check Auth) -> getAddresses (Fetch from DB)
router.get("/", verifyToken, getAddresses);

// PUT: /api/address/:id
// sequence: verifyToken (Check Auth) -> updateAddress (Update in DB)
router.put(
  "/:id",
  verifyToken,
  validate(addressValidationSchema.update),
  updateAddress,
);

// DELETE: /api/address/:id
// sequence: verifyToken (Check Auth) -> deleteAddress (Remove from DB)
router.delete("/:id", verifyToken, deleteAddress);

/**
 * PATCH: /api/address/default/:id
 * sequence: verifyToken (Check Auth) -> setDefaultAddress (Toggle Default status)
 */
router.patch("/default/:id", verifyToken, setDefaultAddress);

export default router;
