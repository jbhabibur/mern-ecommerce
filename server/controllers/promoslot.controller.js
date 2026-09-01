import { Storefront } from "../models/storefront.model.js";
import { cloudinary } from "../config/cloudinary.js";
import { asyncHandler } from "../middleware/error.middleware.js";

// @desc    Save or update a promo slot
// @route   POST /api/storefront/promo-slots
// @access  Private/Admin
export const savePromoSlot = asyncHandler(async (req, res) => {
  const { slot_number, category, title, isActive } = req.body;

  // Check if file was uploaded to Cloudinary via Multer
  if (!req.file && !req.body.image) {
    return res
      .status(400)
      .json({ success: false, message: "Image is required" });
  }

  // Prepare the slot object
  const slotData = {
    slot_number: Number(slot_number),
    category,
    title,
    isActive: isActive === "true" || isActive === true,
  };

  // If a new file is uploaded, set the image object
  if (req.file) {
    slotData.image = {
      url: req.file.path,
      public_id: req.file.filename, // This is set by multer-storage-cloudinary
    };
  }

  // Find the storefront (create one if it doesn't exist)
  let storefront = await Storefront.findOne();
  if (!storefront) {
    storefront = await Storefront.create({ promos: [] });
  }

  // Check if slot already exists in the array
  const existingSlotIndex = storefront.promos.findIndex(
    (p) => p.slot_number === Number(slot_number),
  );

  if (existingSlotIndex > -1) {
    // UPDATE: If a new image is uploaded, delete the old one from Cloudinary first
    if (req.file && storefront.promos[existingSlotIndex].image?.public_id) {
      await cloudinary.uploader.destroy(
        storefront.promos[existingSlotIndex].image.public_id,
      );
    }

    // Update existing slot (merge data)
    storefront.promos[existingSlotIndex] = {
      ...storefront.promos[existingSlotIndex].toObject(),
      ...slotData,
      // If no new file, keep the old image
      image: slotData.image || storefront.promos[existingSlotIndex].image,
    };
  } else {
    // CREATE: Push new slot to array
    storefront.promos.push(slotData);
  }

  await storefront.save();

  res.status(200).json({
    success: true,
    message: "Promo slot saved successfully",
    data: storefront.promos,
  });
});

// @desc    Get all promo slots
// @route   GET /api/storefront/promo-slots
// @access  Public
export const getPromoSlots = asyncHandler(async (req, res) => {
  const storefront = await Storefront.findOne().populate("promos.category");

  res.status(200).json({
    success: true,
    data: storefront ? storefront.promos : [],
  });
});

// @desc    Delete a promo slot
// @route   DELETE /api/storefront/promo-slots/:slotId
// @access  Private/Admin
export const deletePromoSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params; // This is the slot_number

  const storefront = await Storefront.findOne();
  if (!storefront)
    return res.status(404).json({ message: "Storefront not found" });

  const slotToDelete = storefront.promos.find(
    (p) => p.slot_number === Number(slotId),
  );

  if (slotToDelete) {
    // Delete from Cloudinary
    if (slotToDelete.image?.public_id) {
      await cloudinary.uploader.destroy(slotToDelete.image.public_id);
    }

    // Remove from MongoDB array
    storefront.promos = storefront.promos.filter(
      (p) => p.slot_number !== Number(slotId),
    );
    await storefront.save();
  }

  res.status(200).json({
    success: true,
    message: "Slot deleted successfully",
  });
});

// @desc    Toggle the active status of a promo slot
// @route   PATCH /api/storefront/promo-slots/:slotId/toggle
// @access  Private/Admin
export const togglePromoStatus = asyncHandler(async (req, res) => {
  const { slotId } = req.params;
  const slotNum = Number(slotId);

  // Find storefront first
  const storefront = await Storefront.findOne({
    "promos.slot_number": slotNum,
  });

  if (!storefront) {
    return res.status(404).json({
      success: false,
      message: `Slot ${slotId} not found`,
    });
  }

  // Find the slot
  const promo = storefront.promos.find((p) => p.slot_number === slotNum);

  // Toggle value
  promo.isActive = !promo.isActive;

  // Save
  await storefront.save();

  res.status(200).json({
    success: true,
    message: `Slot ${promo.isActive ? "activated" : "deactivated"} successfully`,
    data: promo,
  });
});
