import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Make sure the secret name matches your .env file
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Find user and attach to request (excluding password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
