import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // Faster searching by slug
    },
    bannerImage: {
      type: String,
      default: "", // Always return an empty string instead of undefined
    },
    description: {
      type: String,
      default: "",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Self-referencing for child categories
      default: null,
    },
    showOnHome: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Optional: Virtual field to get child categories (if needed later)
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

export default mongoose.model("Category", categorySchema);
