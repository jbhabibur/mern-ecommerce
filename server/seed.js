import mongoose from "mongoose";
import Category from "./models/Category.js";
import dotenv from "dotenv";

dotenv.config();

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing categories to avoid duplicates
    await Category.deleteMany({});
    console.log("Old categories cleared.");

    // Create Parent (Level 1)
    const menTop = await Category.create({
      name: "WINTER COLLECTION",
      slug: "winter-25-26",
      description:
        "𝐄𝐱𝐩𝐥𝐨𝐫𝐞 𝐃𝐨𝐫𝐣𝐢𝐛𝐚𝐫𝐢’𝐬 𝐖𝐢𝐧𝐭𝐞𝐫 𝐄𝐝𝐢𝐭𝐢𝐨𝐧 𝟐𝟓‑𝟐𝟔: premium men’s winter wear designed for style, comfort, and modern elegance.",
      bannerImage: "/uploads/categories/winter.jpg",
      parent: null,
      showOnHome: false,
    });

    // Create Child (Level 2)
    const panjabi = await Category.create({
      name: "Panjabi",
      slug: "panjabi",
      description: "Explore Dorji bari's latest Panjabi collection for men.",
      bannerImage: "/uploads/categories/panjabi.jpg",
      parent: menTop._id,
      showOnHome: true,
    });

    // Create Child (Level 2)
    const shirt = await Category.create({
      name: "Shirt",
      slug: "shirt",
      description:
        "Explore Dorjibari’s stylish men’s shirts with a range of prints, checks, and solid colors.",
      bannerImage: "/uploads/categories/shirt.jpg",
      parent: menTop._id,
      showOnHome: true,
    });

    // Create Child (Level 2)
    const polo = await Category.create({
      name: "Polo",
      slug: "polo",
      description: "",
      bannerImage: "/uploads/categories/polo.jpg",
      parent: menTop._id,
      showOnHome: true,
    });

    // Create Child (Level 2)
    const accessories = await Category.create({
      name: "Accessories",
      slug: "accessories",
      description: "",
      bannerImage: "/uploads/categories/accessories.jpg",
      parent: null,
      showOnHome: true,
    });

    console.log("Database Seeded Successfully! 🌱");

    // Close connection
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedCategories();
