import cors from "cors";
import dotenv from "dotenv";

import express from "express";

import connectDB from "./config/db.js";

// Routes Import (Category routes amra bad diyechi)
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Database Connection
connectDB();

const app = express();

/**
 * Global Middlewares
 */
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Allow requests from different origins (Frontend)

/**
 * Static Assets
 */
app.use("/uploads", express.static("uploads"));

/**
 * API Routes mounting
 * Ekhon /api/products route-e shob dynamic filtering (New Arrivals, Winter, Panjabi) kaj korbe.
 */
// Categories API (for admin or navigation menus)
app.use("/api/categories", categoryRoutes);

// Products API (for the shop and category pages)
app.use("/api/products", productRoutes);

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
