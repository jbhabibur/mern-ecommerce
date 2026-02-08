import mongoose from "mongoose";

/**
 * Category Schema
 * Optimized for granular visibility control on Homepage and Category Menus.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      index: true,
    },
    /**
     * Images for different UI placements
     */
    thumbnail: { type: String, default: "" }, // Grid icons / Sidebars
    bannerImage: { type: String, default: "" }, // Top of Category Landing Page
    carouselImage: { type: String, default: "" }, // Homepage Slider Image

    description: { type: String, default: "" },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    /**
     * VISIBILITY CONTROLS
     * showInCarousel: Controls if the promotional image appears in the home slider.
     * showInCategories: Controls if the category appears in menus/shop pages.
     */
    showInCarousel: {
      type: Boolean,
      default: false,
    },
    showInCategories: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for sub-categories remains the same
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

export default mongoose.model("Category", categorySchema);
