// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     slug: { type: String, required: true, unique: true, lowercase: true },
//     description: { type: String },
//     price: { type: Number, required: true }, // Fixed: Number
//     compare_at_price: { type: Number }, // Fixed: Number
//     currency: { type: String, default: "BDT" },

//     parentCategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       default: null,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       default: null,
//     },
//     subcategory: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       default: null,
//     },

//     itemType: {
//       type: String,
//       required: true,
//       enum: ["men-top", "men-bottom", "outware", "accessories"],
//     },

//     images: [
//       {
//         url: { type: String, required: true },
//         isPrimary: { type: Boolean, default: false },
//         isZoomView: { type: Boolean, default: false },
//       },
//     ],
//     variants: [
//       {
//         size: { type: String },
//         stock: { type: Number, required: true, default: 0 }, // Fixed: Number
//       },
//     ],
//     color: { type: String },
//     fabric: { type: String },

//     analytics: {
//       totalSales: { type: Number, default: 0 }, // Fixed: Number
//       totalViews: { type: Number, default: 0 }, // Fixed: Number
//       averageRating: { type: Number, default: 0 }, // Fixed: Number
//       reviewCount: { type: Number, default: 0 }, // Fixed: Number
//       popularityScore: { type: Number, default: 0 }, // Fixed: Number
//     },

//     isNewArrival: { type: Boolean, default: false },
//     bestSeller: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// // Indexes
// productSchema.index({ category: 1, parentCategory: 1 });
// productSchema.index({ "analytics.popularityScore": -1 });

// // Pre-save middleware
// productSchema.pre("save", async function () {
//   try {
//     if (this.isModified("category") && this.category) {
//       const Category = mongoose.model("Category");
//       const categoryDoc = await Category.findById(this.category);
//       if (categoryDoc && categoryDoc.parent) {
//         this.parentCategory = categoryDoc.parent;
//       }
//     }
//     // next();
//   } catch (error) {
//     // next(error);
//   }
// });

// export default mongoose.models.Product ||
//   mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true },
    compare_at_price: { type: Number },
    currency: { type: String, default: "BDT" },

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

    // Media Fields (Cloudinary URLs)
    images: [
      {
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        isZoomView: { type: Boolean, default: false },
        public_id: { type: String }, // Useful for deleting from Cloudinary later
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
