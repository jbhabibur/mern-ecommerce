import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "../config/firebase.config.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Firebase Token Check
    try {
      // If Firebase Admin is not initialized, it will throw an error here
      const firebaseUser = await admin.auth().verifyIdToken(token);

      const user = await User.findOne({ email: firebaseUser.email }).select(
        "-password",
      );

      req.user = user;
      req.firebaseUser = firebaseUser;
      return next();
    } catch (firebaseError) {
      // Log if it is not a Firebase token, then proceed to try custom JWT
      console.log("Not a Firebase token, trying custom JWT...");
    }

    // Custom JWT Check
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET is missing in .env file");
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    req.user = user;
    next();
  } catch (error) {
    // Log the actual error for debugging (Expired token or Secret mismatch?)
    console.error("Auth Middleware Error:", error.message);

    res.status(401).json({
      message: "Not authorized, token failed",
      error: error.message, // Returning error message helps debugging during development
    });
  }
};
