import Joi from "joi";

// Helper to validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("Invalid ID format");
  }
  return value;
};

export const addressValidationSchema = {
  // Schema for creating a new address
  create: Joi.object({
    fullName: Joi.string().trim().required().messages({
      "string.empty": "Full name is required",
    }),

    countryCode: Joi.string().default("+880"),

    phoneNumber: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must contain only digits",
      }),

    division: Joi.string().required().messages({
      "string.empty": "Division is required",
    }),

    city: Joi.string().required().messages({
      "string.empty": "City is required",
    }),

    zone: Joi.string().required().messages({
      "string.empty": "Zone is required",
    }),

    houseAddress: Joi.string().trim().required().messages({
      "string.empty": "Specific address details are required",
    }),

    landmark: Joi.string().trim().allow("", null),

    label: Joi.string().valid("HOME", "OFFICE").default("HOME"),

    isDefaultShipping: Joi.boolean().default(false),
    isDefaultBilling: Joi.boolean().default(false),
  }).unknown(true),

  // Schema for updating an existing address (all fields optional)
  update: Joi.object({
    fullName: Joi.string().trim(),
    countryCode: Joi.string(),
    phoneNumber: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/),
    division: Joi.string(),
    city: Joi.string(),
    zone: Joi.string(),
    houseAddress: Joi.string().trim(),
    landmark: Joi.string().trim().allow("", null),
    label: Joi.string().valid("HOME", "OFFICE"),
    isDefaultShipping: Joi.boolean(),
    isDefaultBilling: Joi.boolean(),
  })
    .min(1)
    .unknown(true), // Ensure at least one field is being updated
};
