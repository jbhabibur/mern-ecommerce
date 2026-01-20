import Product from "../models/Product.js";
import Category from "../models/Category.js";

/**
 * Controller: Bulk Insert Products
 * Description: Directly saves the hierarchical dataset into MongoDB.
 */
export const createBulkProducts = async (req, res) => {
  try {
    const rawProducts = req.body;

    // Validation: Check if body is an array
    if (!Array.isArray(rawProducts)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be an array of products",
      });
    }

    // Processing data: Add slugs if missing
    const processedProducts = rawProducts.map((product) => ({
      ...product,
      slug:
        product.slug ||
        product.name
          .toLowerCase()
          .trim()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
    }));

    // Database Insert
    const createdProducts = await Product.insertMany(processedProducts);

    res.status(201).json({
      success: true,
      count: createdProducts.length,
      message: "Hierarchical products uploaded successfully!",
      data: createdProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk upload failed",
      error: error.message,
    });
  }
};

/**
 * Controller: Get New Arrivals
 * Description: Fetches products where isNewArrival is true.
 */
export const getNewArrivals = async (req, res) => {
  try {
    // Shudu isNewArrival true thaka products fetch korbe
    const products = await Product.find({ isNewArrival: true }).sort({
      createdAt: -1,
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No new arrivals found",
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
      message: "Error fetching new arrivals",
      error: error.message,
    });
  }
};

/**
 * Controller: getProductsByCategory
 * Description: Fetches category metadata and all associated products.
 */
export const getProductsByCategory = async (req, res) => {
  try {
    // Extract the category slug from the URL parameters (e.g., /category/panjabi)
    const { categoryName } = req.params;
    const slug = categoryName.toLowerCase();

    console.log(categoryName);

    // 1. Fetch the Category metadata (Banner, Title, Description) using the slug
    const category = await Category.findOne({ slug });

    // If the category does not exist in the database, return a 404 error
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    /**
     * 2. Fetch products linked to this specific Category ID.
     * Since the migration updated the product documents, we can now use
     * the ObjectId for a fast and efficient search.
     * It checks both the primary 'category' and 'parentCategory' for hierarchy support.
     */
    const products = await Product.find({
      $or: [{ category: category._id }, { parentCategory: category._id }],
    }).sort({ createdAt: -1 }); // Sort by newest products first

    // 3. Send a structured response that matches your frontend 'useCategory' hook
    res.status(200).json({
      success: true,
      categoryData: {
        title: category.name,
        banner: category.bannerImage, // Banner URL from the Category collection
        description: category.description,
      },
      products, // Array of products belonging to this category
    });
  } catch (error) {
    // Handle any unexpected server-side errors
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
