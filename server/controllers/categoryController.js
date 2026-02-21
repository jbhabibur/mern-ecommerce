import Category from "../models/Category.js";
import Product from "../models/Product.js";

/**
 * @desc    Fetch categories with dynamic field selection
 * @route   GET /api/categories/list-all
 * @access  Public
 */
export const getCategoryListOnly = async (req, res) => {
  try {
    const { fields } = req.query;
    let query = Category.find({});

    if (fields) {
      const selectedFields = fields.split(",").join(" ");
      query = query.select(selectedFields);
    }

    const categories = await query.sort({ name: 1 }).lean();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Category List-all Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch categories",
    });
  }
};

/**
 * @desc    Fetch category details and associated products by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("hello");

    const categoryDetails = await Category.findOne({ slug }).lean();

    if (!categoryDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const products = await Product.find({ category: categoryDetails._id })
      .select("name price images variants description slug")
      .lean();

    res.status(200).json({
      success: true,
      categoryData: {
        title: categoryDetails.name,
        slug: categoryDetails.slug,
        thumbnail: categoryDetails.thumbnail,
        banner: categoryDetails.bannerImage,
        carousel: categoryDetails.carouselImage,
        description: categoryDetails.description,
        showInCarousel: categoryDetails.showInCarousel,
        showInCategories: categoryDetails.showInCategories,
      },
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * @desc    Create a new category with manual slug and visibility support
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug: manualSlug,
      description,
      parent,
      showInCarousel,
      showInCategories,
      carouselSync,
    } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required." });
    }

    // SLUG LOGIC
    const finalSlug = (manualSlug || name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const existingCategory = await Category.findOne({ slug: finalSlug });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category or Slug already exists." });
    }

    const thumbnail = req.files?.thumbnail ? req.files.thumbnail[0].path : "";
    const bannerUrl = req.files?.bannerImage
      ? req.files.bannerImage[0].path
      : "";

    let carouselUrl = "";
    if (carouselSync === "true") {
      carouselUrl = bannerUrl;
    } else {
      carouselUrl = req.files?.carouselImage
        ? req.files.carouselImage[0].path
        : "";
    }

    const newCategory = new Category({
      name,
      slug: finalSlug,
      thumbnail,
      bannerImage: bannerUrl,
      carouselImage: carouselUrl,
      description,
      parent: parent === "null" || !parent ? null : parent,
      showInCarousel: showInCarousel === "true" || showInCarousel === true,
      showInCategories:
        showInCategories === "true" || showInCategories === true,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully!",
      data: newCategory,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Fetch all categories with counts and visibility status
 * @route   POST /api/categories/all
 */
export const getAllCategory = async (req, res) => {
  try {
    const { page } = req.body;
    const currentPage = Math.max(1, parseInt(page) || 1);
    const limit = 8;
    const skip = (currentPage - 1) * limit;

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "categoryProducts",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          slug: 1,
          thumbnail: 1,
          bannerImage: 1,
          carouselImage: 1,
          showInCarousel: 1, // Added
          showInCategories: 1, // Added
          displayImage: {
            $cond: {
              if: { $gt: ["$thumbnail", ""] },
              then: "$thumbnail",
              else: {
                $cond: {
                  if: { $gt: ["$bannerImage", ""] },
                  then: "$bannerImage",
                  else: { $arrayElemAt: ["$categoryProducts.images", 0] },
                },
              },
            },
          },
          productCount: { $size: "$categoryProducts" },
        },
      },
    ]);

    const total = await Category.countDocuments({});

    res.status(200).json({
      success: true,
      data: categories,
      hasMore: skip + categories.length < total,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Update specific category images individually
 */
export const updateCategoryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    if (req.files?.thumbnail)
      updateData.thumbnail = req.files.thumbnail[0].path;
    if (req.files?.bannerImage)
      updateData.bannerImage = req.files.bannerImage[0].path;
    if (req.files?.carouselImage)
      updateData.carouselImage = req.files.carouselImage[0].path;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided." });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Image updated!",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update status/fields and regenerate slug if name changes
 */
export const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // If name is being updated, regenerate slug
    if (updates.name) {
      updates.slug = updates.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
