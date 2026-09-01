import Wishlist from "../models/Wishlist.js";

// @desc    Toggle product in user's wishlist (Add if not exists, remove if exists)
// @route   POST /api/wishlist/toggle
// @access  Private (Authenticated Users)
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({ user: userId });

    // Check if wishlist doesn't exist, create a new one with the product
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });
    } else {
      // Check if product already exists in the wishlist
      const isExist = wishlist.products.includes(productId);

      if (isExist) {
        // Remove product if it already exists
        wishlist.products = wishlist.products.filter(
          (id) => id.toString() !== productId,
        );
      } else {
        // Add product if it does not exist
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    // Populate and fetch the updated wishlist to send detailed product objects to the frontend
    const updatedWishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
    );

    res.status(200).json({
      success: true,
      message: "Wishlist updated successfully",
      products: updatedWishlist.products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently authenticated user's wishlist
// @route   GET /api/wishlist
// @access  Private (Authenticated Users)
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
    );

    if (!wishlist) {
      return res.status(200).json({ success: true, products: [] });
    }

    res.status(200).json({ success: true, products: wishlist.products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
