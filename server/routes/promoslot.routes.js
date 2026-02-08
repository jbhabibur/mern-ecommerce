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

// Fetch all slots
router.get("/", getPromoSlots);

// Create or Update (handles logic for both based on slot_number)
router.post(
  "/promo-slots",
  upload.single("image"),
  validate(promoSlotSchema),
  savePromoSlot,
);

// Delete by slot number
router.delete("/:slotId", deletePromoSlot);

router.patch("/:slotId/status", togglePromoStatus);

export default router;
