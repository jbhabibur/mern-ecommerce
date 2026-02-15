import Product from "../models/Product.js";
import Category from "../models/Category.js";

import { slugify } from "../utils/slugify.utils.js";
import { asyncHandler } from "../middleware/error.middleware.js";

/**
 * @desc    Fetch products marked as New Arrivals
 * @route   GET /api/new-arrivals
 * @access  Public
 */
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).sort({
      createdAt: -1,
    });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No new arrivals found.",
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
 * @desc    Fetch top 8 products based on popularity score
 * @route   GET /api/products/popular
 * @access  Public
 */
export const getPopularProducts = async (req, res) => {
  try {
    // 1. Find all products
    // 2. Sort by popularityScore in descending order (-1 means highest first)
    // 3. Limit the result to exactly 8 products
    const popularProducts = await Product.find()
      .sort({ "analytics.popularityScore": -1 })
      .limit(8);

    // Check if any products exist
    if (!popularProducts || popularProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No popular products found.",
      });
    }

    // Return the successful response with data
    res.status(200).json({
      success: true,
      count: popularProducts.length,
      data: popularProducts,
    });
  } catch (error) {
    // Handle server-side errors
    res.status(500).json({
      success: false,
      message: "Error retrieving popular products.",
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch products by category (including sub-categories)
 * @route   GET /api/categories/:categoryName
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const slug = categoryName.toLowerCase();

    // 1️⃣ Find category metadata
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found.`,
      });
    }

    // 2️⃣ Find products under this category or its parent
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
 * @desc    Fetch a single product by its slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getSingleProductBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  // Database Query: Attempt to find product and exclude internal/unnecessary fields
  const product = await Product.findOne({ slug }).select({
    category: 0,
    parentCategory: 0,
    __v: 0, // Industry Standard: Usually exclude the version key
  });

  // Resource Check: Handle cases where the slug does not match any document
  if (!product) {
    const error = new Error("Product not found.");
    error.status = 404;
    return next(error);
  }

  // Success Response: Return the product data
  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create a new product with full classification and analytics
 * @route   POST /api/product/add
 * @access  Admin / Private
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  // 1. Basic Fields Extraction
  const {
    name,
    slug,
    description,
    price,
    compare_at_price,
    currency,
    itemType, // New field added
    parentCategory,
    category,
    subcategory,
    imageMetadata,
    color,
    fabric,
    variants,
    isNewArrival,
    bestSeller,
    analytics, // Received as a JSON string from FormData
  } = req.body;

  // 2. Data Parsing with Safety Fallbacks
  // Since FormData sends everything as strings, we must parse JSON fields
  const parsedMetadata = imageMetadata ? JSON.parse(imageMetadata) : [];
  const parsedVariants = variants ? JSON.parse(variants) : [];
  const parsedAnalytics = analytics ? JSON.parse(analytics) : {};

  // 3. Image Handling (Merging Cloudinary storage data with UI metadata)
  let imageObjects = [];
  if (req.files && req.files.length > 0) {
    imageObjects = req.files.map((file, index) => ({
      url: file.path, // URL from Cloudinary
      public_id: file.filename, // Cloudinary Public ID for future deletions
      isPrimary: parsedMetadata[index]?.isPrimary || false,
      isZoomView: parsedMetadata[index]?.isZoomView || false,
    }));
  }

  // 4. Product Data Object Preparation
  const productData = {
    name,
    itemType, // Assigned to the new schema field
    slug: slug
      ? slugify(slug, { lower: true })
      : slugify(name, { lower: true }),
    description,
    price: Number(price),
    compare_at_price: compare_at_price ? Number(compare_at_price) : undefined,
    currency: currency || "BDT",
    parentCategory: parentCategory || null,
    category: category || null,
    subcategory: subcategory || null,
    images: imageObjects,
    color: color || "",
    fabric: fabric || "",
    variants: parsedVariants,

    // Handle Boolean conversion from FormData strings
    isNewArrival: isNewArrival === "true" || isNewArrival === true,
    bestSeller: bestSeller === "true" || bestSeller === true,

    // Mapping Analytics with strict number conversion
    analytics: {
      totalSales: Number(parsedAnalytics.totalSales) || 0,
      totalViews: Number(parsedAnalytics.totalViews) || 0,
      reviewCount: Number(parsedAnalytics.reviewCount) || 0,
      averageRating: Number(parsedAnalytics.averageRating) || 0,
      popularityScore: Number(parsedAnalytics.popularityScore) || 0,
    },
  };

  // 5. Database Operation
  const newProduct = new Product(productData);
  const savedProduct = await newProduct.save();

  // 6. Final Response
  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    data: savedProduct,
  });
});
