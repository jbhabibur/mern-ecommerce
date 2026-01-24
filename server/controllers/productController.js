import Product from "../models/Product.js";
import Category from "../models/Category.js";

/**
 * @desc    Bulk Insert Products with automated slug generation
 * @route   POST /api/bulk
 * @access  Private/Admin
 */
export const createBulkProducts = async (req, res) => {
  try {
    const rawProducts = req.body;

    if (!Array.isArray(rawProducts)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Request body must be an array.",
      });
    }

    // Process products to ensure every item has a URL-friendly slug
    const processedProducts = rawProducts.map((product) => ({
      ...product,
      slug:
        product.slug ||
        product.name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "") // Remove special characters
          .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
          .replace(/^-+|-+$/g, ""), // Trim hyphens from ends
    }));

    const createdProducts = await Product.insertMany(processedProducts);

    res.status(201).json({
      success: true,
      count: createdProducts.length,
      message: "Products uploaded and processed successfully.",
      data: createdProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk upload operation failed.",
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch products tagged as New Arrivals
 * @route   GET /api/new-arrivals
 * @access  Public
 */
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).sort({
      createdAt: -1,
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No new arrivals found at this time.",
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving new arrivals.",
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch category metadata and all associated products (including sub-categories)
 * @route   GET /api/categories/:categoryName
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const slug = categoryName.toLowerCase();

    // 1. Locate the category metadata
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found.`,
      });
    }

    // 2. Query products belonging to this category or its parent category
    const products = await Product.find({
      $or: [{ category: category._id }, { parentCategory: category._id }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categoryData: {
        title: category.name,
        banner: category.bannerImage,
        description: category.description,
      },
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products for this category.",
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch a single product detail by slug with populated references
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    // Use an object to specify what to exclude (0 means exclude)
    const product = await Product.findOne({ slug }).select({
      category: 0,
      parentCategory: 0,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // Check your terminal/console where the backend is running
    // It will show the exact line causing the 500 error
    console.error("Error in getSingleProduct:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
