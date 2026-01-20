import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compare_at_price: { type: Number },
    currency: { type: String, default: "BDT" },

    // Primary Category link (e.g., Panjabi)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Parent Category link (e.g., Winter Collection)
    // This allows you to find all winter items at once.
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    itemType: {
      type: String,
      required: true,
      enum: ["men-top", "men-bottom", "outware", "accessories"],
    },

    images: [{ type: String, required: true }],
    variants: [
      {
        size: { type: String },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    color: { type: String },
    fabric: { type: String },
    isNewArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Faster filtering for category-based queries
productSchema.index({ category: 1, parentCategory: 1 });

/**
 * MIDDLEWARE: Automatically set parentCategory before saving
 * If you assign a product to "Panjabi", this script finds if "Panjabi"
 * has a parent (like "Winter Collection") and saves it.
 */
productSchema.pre("save", async function (next) {
  if (this.isModified("category")) {
    const Category = mongoose.model("Category");
    const cat = await Category.findById(this.category);
    if (cat && cat.parent) {
      this.parentCategory = cat.parent;
    }
  }
  next();
});

export default mongoose.model("Product", productSchema);
