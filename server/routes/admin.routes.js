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

/**
 * @desc    Request Access - Allows both Public users and Super Admins to create an invitation
 * @route   POST /api/admin/request-access
 * @access  Public / Private (Super Admin)
 */
router.post("/request-access", requestInvitation);

// Step 3: Admin Password Setup - New admin sets up profile via email link
router.post("/setup-password", setupInvitedAdmin);

/**
 * @desc    Fetch all pending and approved invitations for the Admin Dashboard
 * @access  Private (Super Admin Only)
 * @route   GET /api/admin-invitation/all
 */
router.get(
  "/all",
  verifyToken,
  restrictTo("super-admin", "admin"),
  getAllInvitations,
);

/**
 * @desc    Approve a pending request and send/resend the setup invitation email
 * @access  Private (Super Admin Only)
 * @method  POST /api/admin/accept/:id
 */
router.post(
  "/accept/:id",
  verifyToken,
  restrictTo("super-admin"),
  approveAndInviteAdmin,
);

/**
 * @desc    Super Admin: Refresh token and resend the invitation email
 * @route   POST /api/admin-invitation/resend/:id
 * @access  Private (Super Admin Only)
 */
router.post(
  "/resend/:id",
  verifyToken,
  restrictTo("super-admin"),
  resendInvitation,
);

// Update Role: Change role and trigger notification email
// Frontend: axios.patch(`${BASE_URL}/api/admin-invitation/update-role/:id`)
router.patch(
  "/update-role/:id",
  verifyToken,
  restrictTo("super-admin"),
  updateInvitationRole,
);

/**
 * @desc    Super Admin: Revoke or delete a pending/approved invitation
 * @access  Private (Super Admin Only)
 * @route   DELETE /api/admin/revoke/:id
 */
router.delete(
  "/revoke/:id",
  verifyToken,
  restrictTo("super-admin"),
  revokeInvitation,
);

export default router;
