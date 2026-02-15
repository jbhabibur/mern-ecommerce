import jwt from "jsonwebtoken";

/**
 * Generates Access & Refresh tokens and sets the Refresh token in a secure cookie.
 * @param {Object} user - The user object from the database.
 * @param {Object} res - The Express response object.
 * @returns {String} accessToken
 */
export const sendTokens = (user, res) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_SECRET_EXPIRES_IN || "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_SECRET_EXPIRES_IN || "7d" },
  );

  // Set Refresh Token in a secure HTTP-only Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Always true for cross-domain/production
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};
