import Joi from "joi";

// Update Profile Schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().allow("", null).optional(),
  birthday: Joi.string().allow("", null).optional(),
  gender: Joi.string()
    .valid("Male", "Female", "Other", "Select Gender")
    .optional(),
  isSubscribed: Joi.boolean().optional(),
});

// Change Password Schema
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Confirm password does not match new password",
  }),
});
