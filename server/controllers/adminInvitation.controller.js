import crypto from "crypto";
import Invitation from "../models/Invitation.js";
import User from "../models/User.js";
import { transporter } from "../config/mail.config.js";

import { asyncHandler } from "../middleware/error.middleware.js";
import { hashPassword } from "../utils/auth.utils.js";
import { sendAdminInviteEmail } from "../services/email.service.js";

/**
 * @desc    Submit an access request for approval (Accessible by Public & Super Admin)
 * @route   POST /api/admin/request-access
 * @access  Public
 */
export const requestInvitation = asyncHandler(async (req, res) => {
  const { email, name, isSystemGenerated } = req.body;

  // 1. Check if a registered user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "This email is already registered as an admin.",
    });
  }

  // 2. Prevent duplicate pending requests
  const invitationExists = await Invitation.findOne({
    email,
    status: "pending",
  });
  if (invitationExists) {
    return res.status(400).json({
      success: false,
      message: "An invitation request is already pending for this email.",
    });
  }

  // 3. Generate token and expiry (Important: Always do this)
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Valid for 24 hours

  // 4. Create new invitation entry
  // Make sure 'token' and 'expiresAt' are passed here
  const invitation = await Invitation.create({
    email,
    name,
    token, // Saved to DB
    expiresAt, // Saved to DB
    status: "pending",
    role: "admin",
  });

  const dynamicName = invitation.name || invitation.email.split("@")[0];

  /**
   * 5. Conditional Email Logic:
   * Only send email if Super Admin triggers it (isSystemGenerated)
   */
  if (isSystemGenerated) {
    const setupUrl = `${process.env.CLIENT_URL}/account/setup-admin?token=${token}&email=${invitation.email}`;

    try {
      await sendAdminInviteEmail({
        email: invitation.email,
        name: dynamicName,
        role: invitation.role,
        setupUrl: setupUrl,
      });

      return res.status(201).json({
        success: true,
        message: `Invitation link sent successfully to ${dynamicName}!`,
      });
    } catch (error) {
      console.error("System Invitation Email Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Invitation created but email failed to send.",
      });
    }
  }

  // 6. Response for random user requests (DB save only)
  res.status(201).json({
    success: true,
    message: "Request submitted! A Super Admin will review your access soon.",
  });
});

/**
 * @desc    Approve a pending admin request and send setup credentials
 * @route   POST /api/admin/accept/:id
 * @access  Private (Super Admin)
 */
export const approveAndInviteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // 1. Retrieve the invitation from the database
  const invite = await Invitation.findById(id);
  if (!invite) {
    return res
      .status(404)
      .json({ success: false, message: "Invitation not found." });
  }

  // 2. Generate a secure token and set 24-hour expiration
  const token = crypto.randomBytes(32).toString("hex");
  invite.token = token;
  invite.role = role || invite.role;
  invite.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await invite.save();

  // 3. Logic for dynamic name: uses provided name or email prefix
  const dynamicName = invite.name || invite.email.split("@")[0];

  // 4. Construct the setup URL for the frontend
  const setupUrl = `${process.env.CLIENT_URL}/account/setup-admin?token=${token}&email=${invite.email}`;

  try {
    // 5. Send the email using the centralized service
    await sendAdminInviteEmail({
      email: invite.email,
      name: dynamicName,
      role: invite.role,
      setupUrl: setupUrl,
    });

    res.status(200).json({
      success: true,
      message: `Invitation link sent successfully to ${dynamicName}!`,
    });
  } catch (error) {
    console.error("Invitation Process Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

/**
 * @desc    Super Admin: Resend existing invitation (Triggered by Refresh Icon)
 * @route   POST /api/admin-invitation/resend/:id
 */
/**
 * @desc    Super Admin: Resend existing invitation (Triggered by Refresh Icon)
 * @route   POST /api/admin-invitation/resend/:id
 */
export const resendInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Find the invitation
  const invite = await Invitation.findById(id);

  if (!invite) {
    return res.status(404).json({
      success: false,
      message: "Invitation not found.",
    });
  }

  // 2. Check if the user is already registered (Safety check)
  const userExists = await User.findOne({ email: invite.email });
  if (userExists) {
    // If user exists, the invitation is no longer "pending" in reality
    invite.status = "accepted";
    await invite.save();
    return res.status(400).json({
      success: false,
      message: "This user is already registered and active.",
    });
  }

  // 3. Ensure the invitation is still in pending status
  if (invite.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: `Cannot resend an invitation that is already ${invite.status}.`,
    });
  }

  // 4. Refresh token and expiry (Extend for another 24 hours)
  const newToken = crypto.randomBytes(32).toString("hex");
  invite.token = newToken;
  invite.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await invite.save();

  // 5. Construct URL and Send Email
  const setupUrl = `${process.env.CLIENT_URL}/account/setup-admin?token=${newToken}&email=${invite.email}`;
  const dynamicName = invite.name || invite.email.split("@")[0];

  try {
    // Using your helper function for consistency
    await sendAdminInviteEmail({
      email: invite.email,
      name: dynamicName,
      role: invite.role,
      setupUrl: setupUrl,
    });

    res.status(200).json({
      success: true,
      message: `Invitation email resent successfully to ${invite.email}!`,
    });
  } catch (error) {
    console.error("Resend Invitation Email Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Token refreshed, but email failed to send.",
    });
  }
});

/**
 * @desc    Super Admin: Update role and notify via email
 * @route   PATCH /api/admin-invitation/update-role/:id
 */
export const updateInvitationRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const invite = await Invitation.findByIdAndUpdate(
    id,
    { role },
    { new: true },
  );
  if (!invite) {
    return res
      .status(404)
      .json({ success: false, message: "Invitation not found." });
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: invite.email,
    subject: "Admin Role Updated",
    html: `<p>Your assigned role has been updated to: <b>${role}</b>.</p>`,
  });

  res
    .status(200)
    .json({ success: true, message: "Role updated and user notified." });
});

/**
 * @desc    Public: New Admin sets up account via Email link
 * @route   POST /api/adminsetup-password
 */
export const setupInvitedAdmin = asyncHandler(async (req, res) => {
  const { token, email, password, firstName, lastName } = req.body;
  console.log(token, email, password, firstName, lastName);

  const invite = await Invitation.findOne({
    token,
    email,
    status: "pending",
    expiresAt: { $gt: Date.now() },
  });

  if (!invite) {
    return res
      .status(410)
      .json({ success: false, message: "Link invalid or expired." });
  }

  const hashedPassword = await hashPassword(password);
  await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: invite.role,
    isVerified: true,
    accountStatus: "active",
  });

  invite.status = "accepted";
  await invite.save();

  res
    .status(201)
    .json({ success: true, message: "Setup complete. You can now login." });
});

/**
 * @desc    Super Admin: Retrieve all admin invitations for the Dashboard table
 * @route   GET /api/admin/all
 * @access  Private (Super Admin Only)
 */
export const getAllInvitations = asyncHandler(async (req, res) => {
  const invitations = await Invitation.find().sort({ createdAt: -1 });

  // Map 'status' to the colors/labels your UI expects
  const formattedData = invitations.map((invite) => ({
    ...invite._doc,
    accountStatus: invite.status === "accepted" ? "active" : "pending",
  }));

  res.status(200).json({ success: true, data: formattedData });
});

/**
 * @desc    Super Admin: Permanently revoke or delete an invitation request
 * @route   DELETE /api/admin/revoke/:id
 * @access  Private (Super Admin Only)
 */
export const revokeInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Attempt to find and delete the invitation by its ID
  const invitation = await Invitation.findByIdAndDelete(id);

  // Return an error if the invitation does not exist
  if (!invitation) {
    return res.status(404).json({
      success: false,
      message: "Invitation not found.",
    });
  }

  // Confirm successful deletion
  res.status(200).json({
    success: true,
    message: "Invitation revoked successfully.",
  });
});
