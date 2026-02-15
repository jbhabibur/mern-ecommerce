import Address from "../models/Address.js";
import { asyncHandler } from "../middleware/error.middleware.js";

/**
 * @desc    Create a new shipping address
 * @route   POST /api/address
 * @access  Private
 */
export const createAddress = asyncHandler(async (req, res) => {
  // Joi has already validated the presence of required fields
  // req.user._id is coming from your auth middleware
  const userId = req.user._id;

  const newAddress = await Address.create({
    ...req.body, // Spread validated data (fullName, phoneNumber, etc.)
    user: userId,
  });

  res.status(201).json({
    success: true,
    message: "Address saved successfully",
    data: newAddress,
  });
});

/**
 * @desc    Get all addresses for the logged-in user
 */
export const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addresses = await Address.find({ user: userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: addresses.length,
    data: addresses,
  });
});

/**
 * @desc    Update an existing address
 * @route   PUT /api/address/:id
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  // 1. Verify ownership and existence
  const address = await Address.findOne({ _id: id, user: userId });
  if (!address) {
    res.status(404);
    throw new Error("Address not found or unauthorized");
  }

  // 2. Update with validated req.body from Joi
  const updatedAddress = await Address.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: updatedAddress,
  });
});

/**
 * @desc    Set default shipping or billing address
 */
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;
  const userId = req.user._id;

  const field = type === "shipping" ? "isDefaultShipping" : "isDefaultBilling";

  // Reset other addresses' default status for this specific user if setting to true
  if (status === true) {
    await Address.updateMany({ user: userId }, { [field]: false });
  }

  const updated = await Address.findByIdAndUpdate(
    id,
    { [field]: status },
    { new: true },
  );

  if (!updated) {
    res.status(404);
    throw new Error("Address not found");
  }

  res.status(200).json({
    success: true,
    message: "Default status updated successfully",
    data: updated,
  });
});

/**
 * @desc    Delete an address
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const address = await Address.findOneAndDelete({ _id: id, user: userId });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});
