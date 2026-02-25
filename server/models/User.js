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
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
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
