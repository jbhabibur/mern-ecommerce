import mongoose from "mongoose";

const storefrontSchema = new mongoose.Schema(
  {
    // Additional global storefront fields can be added here (e.g., banner text, theme colors)
    promos: [
      {
        slot_number: {
          type: Number,
          required: [true, "Slot number is mandatory"],
          /** * NOTE: 'unique: true' inside an array of subdocuments
           * does not behave like a standard unique constraint in MongoDB.
           */
        },
        image: {
          url: {
            type: String,
            required: [true, "Image URL is required"], // secure_url from Cloudinary
          },
          public_id: {
            type: String,
            required: [true, "Public ID is required"], // Necessary for deleting/updating files in Cloudinary
          },
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category", // Reference to the Category model
          required: [true, "Category must be linked as a Mongoose Object"],
        },
        title: {
          type: String,
          trim: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    social_feed: [
      {
        image: {
          url: {
            type: String,
            required: [true, "Image URL is mandatory"],
          },
          public_id: {
            type: String,
            required: [true, "Cloudinary public_id is mandatory"],
          },
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

// Named export
export const Storefront = mongoose.model("Storefront", storefrontSchema);
