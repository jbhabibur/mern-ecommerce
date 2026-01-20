import Category from "../models/Category.js";
import Product from "../models/Product.js";

/**
 * Fetch category details and its associated products using the category slug.
 */
export const getCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // 1. Fetch category details using the slug
    const categoryDetails = await Category.findOne({
      slug: categoryName,
    }).lean();

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 2. Fetch products using the Category's unique ID for better performance
    const products = await Product.find({ category: categoryDetails._id })
      .select("name price images variants description slug")
      .lean();

    // 3. Send Response
    res.status(200).json({
      success: true,
      categoryData: {
        title: categoryDetails.name,
        banner: categoryDetails.bannerImage,
        description: categoryDetails.description,
      },
      products: products,
    });
  } catch (error) {
    console.error("Error in getCategory:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Create a new category and automatically generate a slug.
 */
export const createCategory = async (req, res) => {
  try {
    const { name, bannerImage, description, parent, showOnHome } = req.body;

    // 1. Basic Validation
    if (!name || !bannerImage) {
      return res.status(400).json({
        success: false,
        message: "Name and Banner Image are required.",
      });
    }

    // 2. Generate Slug automatically
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    // 3. Check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists.",
      });
    }

    // 4. Create and Save
    const newCategory = new Category({
      name,
      slug,
      bannerImage,
      description,
      parent: parent || null,
      showOnHome: showOnHome || false,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully!",
      data: newCategory,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
