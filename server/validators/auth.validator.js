import Joi from "joi";

/**
 * Register Schema
 * Used to validate user data during the signup process.
 * Password is set to optional to support Social/Firebase authentication.
 */
export const registerSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
  }),
  // Logic: Required if firebaseUid is missing
  password: Joi.string()
    .min(6)
    .when("firebaseUid", {
      is: Joi.exist(),
      then: Joi.string().allow("", null).optional(),
      otherwise: Joi.string().required(),
    })
    .messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required for email registration",
    }),
  firebaseUid: Joi.string().optional(), // Must be here for .when() to check it
  isSubscribed: Joi.boolean().optional(),
});

/**
 * Login Schema
 * Used to validate credentials during login.
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
  }),
  password: Joi.string().when("isSocialLogin", {
    is: true,
    then: Joi.string().allow("", null).optional(),
    otherwise: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  }),
  isSocialLogin: Joi.boolean().optional(), // Flag sent from frontend for social logins
});

/**
 * Forgot Password Schema
 * Used to validate the email address for password recovery.
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
});
