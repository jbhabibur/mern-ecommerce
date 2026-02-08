import express from "express";
import {
  savePromoSlot,
  getPromoSlots,
  deletePromoSlot,
  togglePromoStatus,
} from "../controllers/storefront.controller.js";
import upload from "../middleware/multer.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { promoSlotSchema } from "../validators/promoslot.validator.js";

const router = express.Router();

// Fetch all slots
router.get("/promo-slots", getPromoSlots);

// Create or Update (handles logic for both based on slot_number)
router.post(
  "/promo-slots",
  upload.single("image"),
  validate(promoSlotSchema),
  savePromoSlot,
);

// Delete by slot number
router.delete("/promo-slots/:slotId", deletePromoSlot);

router.patch("/promo-slots/:slotId/status", togglePromoStatus);

export default router;
