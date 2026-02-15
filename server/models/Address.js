import mongoose from "mongoose";

const addressSchema = mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    // Phone Details
    countryCode: {
      type: String,
      default: "+880",
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Location Hierarchy (Matches BD_LOCATIONS structure)
    division: {
      type: String,
      required: [true, "Division is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    zone: {
      type: String,
      required: [true, "Zone is required"],
    },

    // Detailed Address
    houseAddress: {
      type: String,
      required: [true, "Specific address details are required"],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },

    // Delivery Label (Home/Office)
    label: {
      type: String,
      enum: ["HOME", "OFFICE"],
      default: "HOME",
    },

    // Default Status (For checkout and billing selection)
    isDefaultShipping: {
      type: Boolean,
      default: false,
    },
    isDefaultBilling: {
      type: Boolean,
      default: false,
    },

    // User Reference (Assuming addresses belong to a logged-in user)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  },
);

// Create the model
const Address = mongoose.model("Address", addressSchema);

export default Address;
