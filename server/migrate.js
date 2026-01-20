import mongoose from "mongoose";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// .env file load korar jonno path set kora
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const migrateData = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined in .env file");

    await mongoose.connect(uri);
    console.log("Connected to Database...");

    // 1. Shob category khunje ber kora
    const categories = await Category.find({});

    for (const cat of categories) {
      console.log(`Processing Category: ${cat.name}`);

      // 2. Product-er itemType-er shathe Category-r slug match korano
      // Aponar image_ca572b.png anujayi itemType: "men-top" thakle sheti category id-te convert hobe
      const result = await Product.updateMany(
        {
          $or: [
            { itemType: cat.slug },
            { "parentCategory.slug": cat.slug },
            { "category.slug": cat.slug },
          ],
        },
        {
          $set: {
            category: cat._id, // Category collection-er _id link kora
            parentCategory: cat.parent, // Jodi parent thake
          },
        },
      );
      console.log(`Updated ${result.modifiedCount} products for ${cat.name}`);
    }

    console.log("Migration finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
};

migrateData();
