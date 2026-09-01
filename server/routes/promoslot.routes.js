import express from "express";
import {
  savePromoSlot,
  getPromoSlots,
  deletePromoSlot,
  togglePromoStatus,
} from "../controllers/promoslot.controller.js";
import upload from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { promoSlotSchema } from "../validators/promoslot.validator.js";

const router = express.Router();

// @desc    Fetch all promo slots
// @route   GET /api/promoslots
// @access  Public / Private
router.get("/", getPromoSlots);

// @desc    Create or update a promo slot (handles logic for both based on slot_number)
// @route   POST /api/promoslots/promo-slots
// @access  Private (Admin Only)
router.post(
  "/promo-slots",
  upload.single("image"),
  validate(promoSlotSchema),
  savePromoSlot,
);

// @desc    Delete a promo slot by ID or slot number
// @route   DELETE /api/promoslots/:slotId
// @access  Private (Admin Only)
router.delete("/:slotId", deletePromoSlot);

// @desc    Toggle the active/inactive status of a promo slot
// @route   PATCH /api/promoslots/:slotId/status
// @access  Private (Admin Only)
router.patch("/:slotId/status", togglePromoStatus);

export default router;
