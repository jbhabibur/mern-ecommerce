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
 * @desc    Fetch single product by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;

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
    console.error("Get Single Product Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new product
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
    parentCategory,
    category,
    subcategory,
    imageMetadata, // This is the JSON string sent from the frontend
  } = req.body;

  console.log("Uploaded Files:", req.files);

  // 2. Image Handling (Merging Cloudinary Data with Metadata)
  let imageObjects = [];

  // Parse the metadata string back into an array of objects
  const parsedMetadata = imageMetadata ? JSON.parse(imageMetadata) : [];

  if (req.files && req.files.length > 0) {
    // We map through the uploaded files and merge them with the metadata by index
    imageObjects = req.files.map((file, index) => ({
      url: file.path, // URL provided by Cloudinary
      public_id: file.filename, // Public ID provided by Cloudinary
      // Get booleans from the parsed metadata based on the current file index
      isPrimary: parsedMetadata[index]?.isPrimary || false,
      isZoomView: parsedMetadata[index]?.isZoomView || false,
    }));
  }

  // 3. Data object preparation
  const productData = {
    name,
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
    images: imageObjects, // Now saving the full Array of Objects
  };

  // 4. Save to Database
  const newProduct = new Product(productData);
  const savedProduct = await newProduct.save();

  // 5. Success Response
  res.status(201).json({
    success: true,
    message: "Product Created Successfully with Structured Images",
    data: savedProduct,
  });
});
