import nodemailer from "nodemailer";

import dotenv from "dotenv";

// Load dotenv here to guarantee variables exist for the transporter
dotenv.config();

// Create a singleton transporter instance
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
