// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

import express from "express";
import connectDB from "./config/db.js";

// Routes Import
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import promoslotRoutes from "./routes/promoslot.routes.js";
import socialmediaRoutes from "./routes/socialmedia.routes.js";
import addressRoutes from "./routes/addressRoutes.js";
import checkoutRoutes from "./routes/checkout.route.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

console.log("EMAIL ENV:", process.env.EMAIL_USER, process.env.EMAIL_PASS);

// Initialize Database Connection
connectDB();

const app = express();

/**
 * Global Middlewares
 */
app.use(express.json()); // Body parser

// EKDHOM IMPORTANT: Domain gulo thikmoto thakte hobe
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:5174", // Local development
  "https://mern-ecommerce-cfee.vercel.app", // Purono domain
  "https://mern-ecommerce-kappa-seven.vercel.app", // NOTUN DOMAIN (Vercel-e jeta active)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * Static Assets
 */
app.use("/uploads", express.static("uploads"));

/**
 * API Routes mounting
 */
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Promo Slots Routes
app.use("/api/storefront/promo-slots", promoslotRoutes);
// Social Feed Routes
app.use("/api/storefront/social-feed", socialmediaRoutes);

// Address routes
app.use("/api/address", addressRoutes);

// Checkout routes
app.use("/api/checkouts/", checkoutRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Payment routes
app.use("/api/payment", paymentRoutes);

/**
 * Health Check Route
 */
app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

/**
 * Global Error Handling
 */
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

/**
 * Server Initialization
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
