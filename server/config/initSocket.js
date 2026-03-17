import { Server } from "socket.io";
import dotenv from "dotenv";

// Initialize dotenv to access environment variables
dotenv.config();

let io;

/**
 * Initialize Socket.io instance with the provided HTTP server
 * @param {Object} httpServer - The Node.js HTTP server instance
 * @returns {Object} io - The configured Socket.io server
 */
export const initSocket = (httpServer) => {
  // Define allowed origins from environment variables
  // Splitting by comma allows multiple URLs if needed (e.g., CLIENT_URL,ADMIN_URL)
  const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(
    Boolean,
  ); // Filters out any undefined or null values

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length > 0 ? allowedOrigins : "*", // Fallback to all if not defined
      methods: ["GET", "POST"],
      credentials: true, // Required if you are passing cookies or headers
    },
  });

  // Handle socket connection events
  io.on("connection", (socket) => {
    console.log(`[Socket] Connection established: ${socket.id}`);

    // Handle user disconnection
    socket.on("disconnect", (reason) => {
      console.log(
        `[Socket] User disconnected: ${socket.id} (Reason: ${reason})`,
      );
    });
  });

  return io;
};

/**
 * Global getter to access the Socket.io instance from anywhere in the app
 * @returns {Object} io - The initialized Socket.io instance
 */
export const getIO = () => {
  if (!io) {
    throw new Error("Critical Error: Socket.io has not been initialized!");
  }
  return io;
};
