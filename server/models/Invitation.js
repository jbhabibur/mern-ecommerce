import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      required: false,
      index: { expires: 0 },
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;
