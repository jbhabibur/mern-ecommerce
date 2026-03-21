import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: { type: String, default: "" },
    birthday: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Select Gender"],
      default: "Select Gender",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Password is ONLY required if it's NOT a social/firebase login
      required: function () {
        return !this.firebaseUid; // Matches the field name in your controller
      },
      select: false,
    },
    firebaseUid: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: [
        "super-admin", // Full system access: manage users, settings, and site configuration
        "admin", // Administrative access: general management but restricted from system settings
        "manager", // Operations access: focus on store management and inventory control
        "editor", // Content access: permitted to manage blog posts, products, and banners
        "stylist", // Creative access: manages product curation, lookbooks, and collections
        "customer-support", // Service access: handles order tracking, customer tickets, and inquiries
        "customer", // Default access: standard user account for purchasing and profile management
      ],
      default: "customer", // New accounts default to standard customer privileges
    },
    accountStatus: {
      type: String,
      enum: [
        "active", // Account is fully functional and verified
        "inactive", // Account deactivated by the user
        "suspended", // Access restricted by admin due to policy violations
        "pending", // Invitation sent but password/profile setup is incomplete
        "deleted", // Soft-deleted record; retained for history but login disabled
      ],
      default: "active",
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpires: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    photo: String,
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
