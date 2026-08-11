import Joi from "joi";

export const promoSlotSchema = Joi.object({
  // Slot Identification (Matched with 'slot_number')
  slot_number: Joi.number().integer().required().messages({
    "number.base": "Slot number must be a number",
    "any.required": "Slot number is mandatory to identify the position",
  }),

  // Category Reference
  category: Joi.string().hex().length(24).required().messages({
    "string.length": "Invalid Category ID format",
    "any.required": "Category is required",
  }),

  // Title (Changed from badgeText to title)
  title: Joi.string().trim().allow("", null),

  // isActive (Since your controller handles this)
  isActive: Joi.any().optional(),
});
