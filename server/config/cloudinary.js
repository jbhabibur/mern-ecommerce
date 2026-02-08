import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary account configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup dynamic storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = "mensfashion_general";

    // Set folder path based on request URL
    if (req.originalUrl.includes("product")) {
      const productFolder = req.body.slug || "temp-product";
      folderName = `mensfashion_products/${productFolder}`;
    } else if (req.originalUrl.includes("categories")) {
      const folderMapping = {
        thumbnail: "thumbnails",
        banner: "banners",
        carousel: "carousels",
      };
      const subFolder = folderMapping[file.fieldname] || "others";
      folderName = `mensfashion_categories/${subFolder}`;
    } else if (req.originalUrl.includes("promo")) {
      folderName = "mensfashion_promos";
    } else if (req.originalUrl.includes("social-feed")) {
      folderName = "mensfashion_social_feed";
    }

    // Sanitize filename: Remove extension and replace special characters/spaces with dashes
    const cleanFileName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "-");

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
      // Unique public_id with cleaned name to prevent 500 errors
      public_id: `${Date.now()}-${file.fieldname}-${cleanFileName}`,
    };
  },
});

export { cloudinary, storage };
