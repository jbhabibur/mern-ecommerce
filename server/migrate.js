import mongoose from "mongoose";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const migrateData = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined in .env file");

    await mongoose.connect(uri);
    console.log("Connected to Database...");

    // Fetch all categories from the Category collection
    const categories = await Category.find({});

    for (const cat of categories) {
      console.log(`Processing Category: ${cat.name}`);

      // Update products in the Product collection that match the category slug or its parent category slug
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
            category: cat._id, // Set the category field to the current category's ID
            parentCategory: cat.parent, // Set the parentCategory field to the current category's parent ID
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
