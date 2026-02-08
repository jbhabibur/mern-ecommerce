import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true },
    compare_at_price: { type: Number },
    currency: { type: String, default: "BDT" },

    // Item Classification
    itemType: {
      type: String,
      required: [true, "Item type is required"],
      enum: ["men-top", "men-bottom", "outware", "accessories"],
    },

    // Category Fields
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // Media Fields (Cloudinary Data)
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }, // Required for Cloudinary management
        isPrimary: { type: Boolean, default: false },
        isZoomView: { type: Boolean, default: false },
      },
    ],

    color: { type: String, default: "" },
    fabric: { type: String, default: "" },
    variants: [
      {
        size: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],

    // Product Flags
    isNewArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },

    // Performance & Analytics
    analytics: {
      totalSales: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      popularityScore: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

// Indexes for faster querying
productSchema.index({ itemType: 1 });
productSchema.index({ category: 1 });
productSchema.index({ "analytics.popularityScore": -1 });

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
