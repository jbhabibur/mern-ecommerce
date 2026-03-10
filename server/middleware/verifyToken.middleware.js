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
    // 1. Firebase Token Check
    try {
      // Admin initialize na hole ekhane error throw korbe
      const firebaseUser = await admin.auth().verifyIdToken(token);

      const user = await User.findOne({ email: firebaseUser.email }).select(
        "-password",
      );

      req.user = user;
      req.firebaseUser = firebaseUser;
      return next();
    } catch (firebaseError) {
      // Firebase token na hole console-e dekhte paren (Optional)
      console.log("Not a Firebase token, trying custom JWT...");
    }

    // 2. Custom JWT Check
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
    // Console-e asol error-ti dekhun (Expired token naki Secret mismatch?)
    console.error("Auth Middleware Error:", error.message);

    res.status(401).json({
      message: "Not authorized, token failed",
      error: error.message, // Debugging-er somoy error message pathale thik kora shohoj hoy
    });
  }
};
