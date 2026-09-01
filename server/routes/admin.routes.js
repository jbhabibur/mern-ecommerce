import express from "express";
const router = express.Router();

import {
  requestInvitation,
  approveAndInviteAdmin,
  setupInvitedAdmin,
  getAllInvitations,
  revokeInvitation,
  updateInvitationRole,
  resendInvitation,
} from "../controllers/adminInvitation.controller.js";

import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { restrictTo } from "../middleware/restrictTo.middleware.js";

// @desc    Request Access - Allows both Public users and Super Admins to create an invitation
// @route   POST /api/admin/request-access
// @access  Public / Private (Super Admin)
router.post("/request-access", requestInvitation);

// @desc    Setup Password for Invited Admins - Allows invited admins to set their password
// @route   POST /api/admin/setup-password
// @access  Public (Invited Admins)
router.post("/setup-password", setupInvitedAdmin);

// @desc    Fetch all pending and approved invitations for the Admin Dashboard
// @route   GET /api/admin-invitation/all
// @access  Private (Super Admin Only)
router.get(
  "/all",
  verifyToken,
  restrictTo("super-admin", "admin"),
  getAllInvitations,
);

// @desc    Approve a pending request and send/resend the setup invitation email
// @route   POST /api/admin/accept/:id
// @access  Private (Super Admin Only)
router.post(
  "/accept/:id",
  verifyToken,
  restrictTo("super-admin"),
  approveAndInviteAdmin,
);

// @desc    Super Admin: Refresh token and resend the invitation email
// @route   POST /api/admin-invitation/resend/:id
// @access  Private (Super Admin Only)
router.post(
  "/resend/:id",
  verifyToken,
  restrictTo("super-admin"),
  resendInvitation,
);

// @desc    Update Role: Change role and trigger notification email
// @route   PATCH /api/admin-invitation/update-role/:id
// @access  Private (Super Admin Only)
router.patch(
  "/update-role/:id",
  verifyToken,
  restrictTo("super-admin"),
  updateInvitationRole,
);

// @desc    Super Admin: Revoke or delete a pending/approved invitation
// @route   DELETE /api/admin/revoke/:id
// @access  Private (Super Admin Only)
router.delete(
  "/revoke/:id",
  verifyToken,
  restrictTo("super-admin"),
  revokeInvitation,
);

export default router;
