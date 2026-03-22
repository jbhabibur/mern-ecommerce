import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";

// Internal Configuration & Utils
import connectDB from "./config/db.js";
import { initSocket } from "./config/initSocket.js";

// Route Imports
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import promoslotRoutes from "./routes/promoslot.routes.js";
import socialmediaRoutes from "./routes/socialmedia.routes.js";
import addressRoutes from "./routes/addressRoutes.js";
import checkoutRoutes from "./routes/checkout.route.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import analyticsRoutes from "./routes/analytics.route.js";
import notificationRoutes from "./routes/notification.route.js";
import reviewRoutes from "./routes/review.routes.js";

// 1. Initialize Configuration
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Database Connection
connectDB();

/**
 * 3. Global Middleware Setup
 */
app.use(express.json()); // Parse incoming JSON requests

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mern-ecommerce-cfee.vercel.app",
  "https://mern-ecommerce-two-orpin.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

/**
 * 4. API Route Mounting
 */

// Core Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/admin", adminRoutes);

// Catalog & Storefront
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/storefront/promo-slots", promoslotRoutes);
app.use("/api/storefront/social-feed", socialmediaRoutes);

// Transactional & Customer Routes
app.use("/api/address", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/checkouts", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Utility & Admin Monitoring
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

/**
 * 5. Health Check & Error Handling
 */
app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

// Centralized Error Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

/**
 * 6. Server & Socket Initialization
 */
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
