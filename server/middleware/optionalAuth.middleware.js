import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const optionalAuth = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("DEBUG: No token found. Proceeding as Guest.");
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // DEBUG 1: Check what is inside the token
    console.log("DEBUG: Decoded Token Payload:", decoded);

    // Use decoded.id or decoded._id based on your login payload
    const userId = decoded.id || decoded._id;
    console.log("DEBUG: Extracted User ID from token:", userId);

    const user = await User.findById(userId).select("-password");

    if (user) {
      // DEBUG 2: Check if user was found in MongoDB
      console.log("DEBUG: User found in DB. MongoID:", user._id);
      req.user = user;
    } else {
      console.log("DEBUG: Token valid but User NOT found in Database.");
      req.user = null;
    }

    next();
  } catch (error) {
    console.error("DEBUG: Optional Token Error:", error.message);
    req.user = null;
    next();
  }
};
