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
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name are required.",
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

// Backend Controller: categoryController.js
export const getAllCategory = async (req, res) => {
  try {
    const { page } = req.body;
    // Ensure currentPage is at least 1 and convert to integer
    const currentPage = Math.max(1, parseInt(page) || 1);
    const limit = 8;
    const skip = (currentPage - 1) * limit;

    const categories = await Category.aggregate([
      // 1. Fetch all categories (Parent filter removed to include all levels)
      { $match: {} },

      // 2. Join with the "products" collection based on category ID
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "categoryProducts",
        },
      },

      // 3. Sort by newest first and apply pagination (skip and limit)
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      // 4. Transform data and apply image selection logic
      {
        $project: {
          name: 1,
          slug: 1,
          // Logic: If bannerImage exists and is not empty, use it.
          // Otherwise, fallback to the first image from the linked products.
          displayImage: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$bannerImage", null] },
                  { $ne: ["$bannerImage", ""] },
                ],
              },
              then: "$bannerImage",
              else: { $arrayElemAt: ["$categoryProducts.images", 0] },
            },
          },
          // Calculate the total number of products in this category
          productCount: { $size: "$categoryProducts" },
        },
      },
    ]);

    // Get total count for frontend pagination/infinite scroll logic
    const total = await Category.countDocuments({});

    res.status(200).json({
      success: true,
      data: categories,
      // Boolean to check if more data is available for the next page
      hasMore: skip + categories.length < total,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
