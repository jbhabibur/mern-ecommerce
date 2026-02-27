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

  // --- Classification Validation ---
  itemType: Joi.string()
    .valid("men-top", "men-bottom", "outware", "accessories", "others")
    .required()
    .messages({
      "any.only": "Invalid Item Type selected",
      "any.required": "Item Type is required for classification",
    }),

  // --- Category Validation (MongoDB ObjectId Hex check) ---
  parentCategory: Joi.string().hex().length(24).allow(null, ""),
  category: Joi.string().hex().length(24).allow(null, ""),
  subcategory: Joi.string().hex().length(24).allow(null, ""),

  // --- Metadata & Variants (FormData Strings) ---
  // These allow the stringified JSON sent via FormData to pass validation
  imageMetadata: Joi.string().allow(null, ""),
  variants: Joi.string().allow(null, ""),

  // --- Media Validation ---
  // Validated as optional since Multer processes files separately
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
        isPrimary: Joi.boolean().default(false),
        isZoomView: Joi.boolean().default(false),
      }),
    )
    .optional(),

  color: Joi.string().allow(""),
  fabric: Joi.string().allow(""),

  // --- Product Flags ---
  // truthy allows strings like "true" or "1" from FormData to be treated as Boolean
  isNewArrival: Joi.boolean().truthy("true", "1").default(false),
  bestSeller: Joi.boolean().truthy("true", "1").default(false),

  // --- Analytics Validation ---
  // We use Joi.alternatives because FormData might send this as a string or an object
  analytics: Joi.alternatives()
    .try(
      Joi.object({
        totalSales: Joi.number().min(0).default(0),
        totalViews: Joi.number().min(0).default(0),
        reviewCount: Joi.number().min(0).default(0),
        averageRating: Joi.number().min(0).max(5).default(0),
        popularityScore: Joi.number().default(0),
      }),
      Joi.string().allow(""),
    )
    .optional(),
});
