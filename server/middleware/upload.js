import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Apnar screenshot onujayi folder path
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    // Unique name toiri kora: timestamp-filename.jpg
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });
