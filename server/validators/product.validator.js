import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Product name cannot be empty",
  }),

  // Required because storage.js uses this for Cloudinary folder naming
  slug: Joi.string().lowercase().required().messages({
    "any.required": "Slug is required to organize Cloudinary folders",
  }),

  description: Joi.string().allow(""),
  price: Joi.number().positive().required(),
  compare_at_price: Joi.number().positive().allow(null, ""),
  currency: Joi.string().default("BDT"),

  // --- Category Validation (MongoDB ObjectId Hex check) ---
  parentCategory: Joi.string().hex().length(24).allow(null, ""),
  category: Joi.string().hex().length(24).allow(null, ""),
  subcategory: Joi.string().hex().length(24).allow(null, ""),

  // --- ADD THIS FIELD HERE ---
  // This allows the metadata string sent via FormData to pass validation
  imageMetadata: Joi.string().allow(null, ""),

  // --- Media Validation ---
  // Note: Since req.files is handled by Multer, Joi often sees 'images'
  // as empty during the initial request body check.
  // You can make this .optional() if you are validating images in the controller.
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
        isPrimary: Joi.boolean().default(false),
        isZoomView: Joi.boolean().default(false),
      }),
    )
    .optional(), // Changed to optional here because the files are processed AFTER validation
});
