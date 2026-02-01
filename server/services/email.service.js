import { transporter } from "../config/mail.config.js";
import { verificationTemplate } from "../templetes/verificationEmail.js";
import { successTemplate } from "../templetes/successEmail.js";
import { resetPasswordTemplate } from "../templetes/resetPasswordTemplate.js";

/**
 * Sends a verification email containing an OTP
 */
export const sendVerificationEmail = async ({
  email,
  otp,
  name,
  verificationUrl,
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"BEMAN Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Verify your account - ${otp}`,
      html: verificationTemplate(name, otp, verificationUrl),
    });
    console.log("VERIFICATION URL:", verificationUrl);
    console.log("Verification email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Verification Email Error:", error.message);
  }
};

/**
 * Sends a welcome/success email after verification
 */
export const sendSuccessEmail = async ({ email, name }) => {
  try {
    const info = await transporter.sendMail({
      from: `"BEMAN Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to BEMAN - Verification Successful",
      html: successTemplate(name),
    });
    console.log("Success email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Success Email Error:", error.message);
  }
};

/**
 * Sends a password reset email containing a reset link
 */
export const sendResetPasswordEmail = async ({ email, name, resetUrl }) => {
  try {
    const info = await transporter.sendMail({
      from: `"BEMAN Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - BEMAN",
      html: resetPasswordTemplate(name, resetUrl), // Use the template function
    });
    console.log("Reset email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Reset Email Error:", error.message);
    throw new Error("Failed to send reset email");
  }
};
