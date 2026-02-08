import multer from "multer";
import { storage } from "../config/cloudinary.js";

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
});

export default upload;
