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
  console.log("Hello 2");
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

/**
 * @desc    Search products by query string (Name, Description, Color, itemType, etc.)
 * @route   GET /api/products/search
 * @access  Public
 */
export const searchProducts = asyncHandler(async (req, res, next) => {
  const { query, minPrice, maxPrice, stock, sort } = req.query;

  // 1. Search Regex (Existing logic)
  const keywords = query
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .trim()
    .split(/\s+/)
    .join("|");
  const searchRegex = new RegExp(keywords, "i");

  // 2. Build Filter Object
  let filter = {
    $or: [
      { name: { $regex: searchRegex } },
      { color: { $regex: searchRegex } },
      { fabric: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
    ],
  };

  // Price Filter add kora
  if (minPrice || maxPrice) {
    filter.price = {
      $gte: Number(minPrice) || 0,
      $lte: Number(maxPrice) || 999999,
    };
  }

  // Stock Filter add kora
  if (stock === "inStock") filter.countInStock = { $gt: 0 };
  if (stock === "outOfStock") filter.countInStock = { $eq: 0 };

  // 3. Sorting & Execution
  const products = await Product.find(filter)
    .sort(
      sort === "priceLow"
        ? { price: 1 }
        : sort === "priceHigh"
          ? { price: -1 }
          : { createdAt: -1 },
    )
    .limit(parseInt(req.query.limit) || 20);

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

/**
 * @desc    Fetch all products without pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  // 1. Fetch all products from the database sorted by newest
  const products = await Product.find().sort({ createdAt: -1 });

  // 2. Send response
  res.status(200).json({
    success: true,
    data: products,
    totalProducts: products.length, // Total count of products found
  });
});

/**
 * @desc    Fetch products with pagination and category names
 * @route   GET /api/products/paginated
 * @access  Public
 */
export const getPaginatedProducts = asyncHandler(async (req, res) => {
  // 1. Get page and limit from query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  // 2. Get the total number of products
  const totalProducts = await Product.countDocuments();

  // 3. Fetch products and POPULATE the category field
  const products = await Product.find()
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // 4. Send success response
  res.status(200).json({
    success: true,
    data: products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  });
});

/**
 * @desc    Get all unique sizes across all products for filters/analytics
 * @route   GET /api/products/admin/all-sizes
 * @access  Admin / Private
 */
export const getAllUniqueSizes = asyncHandler(async (req, res) => {
  // 1. Fetch only the 'variants' field from the database
  const products = await Product.find().select("variants");

  // 2. Extract sizes from all product variants
  const sizeSet = new Set();

  products.forEach((product) => {
    product.variants.forEach((variant) => {
      if (variant.size) {
        sizeSet.add(variant.size); // Using a Set ensures no duplicate sizes
      }
    });
  });

  // 3. Convert the Set back into an Array
  const uniqueSizes = Array.from(sizeSet);

  res.status(200).json({
    success: true,
    count: uniqueSizes.length,
    data: uniqueSizes, // Output: ["M", "XL", "15.35", "16", "1-2 Year"]
  });
});

/**
 * @desc    Get size and stock breakdown for a specific product
 * @route   GET /api/products/admin/stock-analysis/:id
 * @access  Admin / Private
 */
export const getProductStockAnalysis = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).select("variants name");

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Format data for chart representation
  const stockData = product.variants.map((v) => ({
    size: v.size,
    stock: v.stock,
  }));

  res.status(200).json({
    success: true,
    productName: product.name,
    data: stockData,
  });
});

/**
 * @desc    Update an existing product with image and metadata management
 * @route   PUT /api/products/update/:id
 * @access  Admin / Private
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the product in db
  let product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  // Extract product data from client
  const {
    name,
    slug,
    description,
    price,
    compare_at_price,
    currency,
    itemType,
    parentCategory,
    category,
    subcategory,
    imageMetadata, // JSON string
    color,
    fabric,
    variants, // JSON string
    isNewArrival,
    bestSeller,
    analytics, // JSON string
  } = req.body;

  // 3. Parse JSON data (these come as strings since they are sent via FormData)
  const parsedMetadata = imageMetadata ? JSON.parse(imageMetadata) : [];
  const parsedVariants = variants ? JSON.parse(variants) : product.variants;
  const parsedAnalytics = analytics ? JSON.parse(analytics) : product.analytics;

  // 4. Image Handling (Smart Merging)
  let updatedImages = [];
  let newFileIndex = 0;

  // Loop through metadata from frontend to build the image list
  parsedMetadata.forEach((meta) => {
    if (meta.isNew === false && meta.url) {
      // This is an existing image that the user did not delete
      // Find the object from the product's current image list
      const existingImg = product.images.find((img) => img.url === meta.url);
      if (existingImg) {
        updatedImages.push({
          ...existingImg,
          isPrimary: meta.isPrimary,
          isZoomView: meta.isZoomView,
        });
      }
    } else if (meta.isNew === true && req.files && req.files[newFileIndex]) {
      // This is a newly uploaded file
      const file = req.files[newFileIndex];
      updatedImages.push({
        url: file.path, // Cloudinary URL
        public_id: file.filename,
        isPrimary: meta.isPrimary,
        isZoomView: meta.isZoomView,
      });
      newFileIndex++;
    }
  });

  // If no images are selected, keep the old images (Safety check)
  if (updatedImages.length === 0 && !imageMetadata) {
    updatedImages = product.images;
  }

  // 5. Create the update data object
  const updateData = {
    name: name || product.name,
    itemType: itemType || product.itemType,
    slug: slug ? slugify(slug, { lower: true }) : product.slug,
    description: description || product.description,
    price: price ? Number(price) : product.price,
    compare_at_price: compare_at_price
      ? Number(compare_at_price)
      : product.compare_at_price,
    currency: currency || product.currency,
    parentCategory: parentCategory || product.parentCategory,
    category: category || product.category,
    subcategory: subcategory || product.subcategory,
    images: updatedImages,
    color: color || product.color,
    fabric: fabric || product.fabric,
    variants: parsedVariants,
    isNewArrival:
      isNewArrival !== undefined
        ? isNewArrival === "true" || isNewArrival === true
        : product.isNewArrival,
    bestSeller:
      bestSeller !== undefined
        ? bestSeller === "true" || bestSeller === true
        : product.bestSeller,
    analytics: {
      totalSales:
        Number(parsedAnalytics.totalSales) || product.analytics.totalSales,
      totalViews:
        Number(parsedAnalytics.totalViews) || product.analytics.totalViews,
      reviewCount:
        Number(parsedAnalytics.reviewCount) || product.analytics.reviewCount,
      averageRating:
        Number(parsedAnalytics.averageRating) ||
        product.analytics.averageRating,
      popularityScore:
        Number(parsedAnalytics.popularityScore) ||
        product.analytics.popularityScore,
    },
  };

  // 6. Database Update
  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true, // Returns the updated data
    runValidators: true,
  });

  // 7. Send Response
  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    data: updatedProduct,
  });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/delete/:id
 * @access  Admin / Private
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  // Delete from the database
  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});
/**
 * @desc    Get inventory statistics for low stock and out of stock products
 * @route   GET /api/products/stats/inventory
 * @access  Admin / Private
 */
export const getStockStats = async (req, res) => {
  try {
    const LOW_STOCK_THRESHOLD = 5;

    const stats = await Product.aggregate([
      {
        $facet: {
          // Count products where ALL variants have 0 stock
          outOfStock: [
            {
              $match: {
                variants: { $not: { $elemMatch: { stock: { $gt: 0 } } } },
              },
            },
            { $count: "count" },
          ],
          // Count products where at least one variant is low stock (but > 0)
          lowStock: [
            {
              $match: {
                variants: {
                  $elemMatch: {
                    stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD },
                  },
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const result = {
      lowStock: stats[0].lowStock[0]?.count || 0,
      outOfStock: stats[0].outOfStock[0]?.count || 0,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
