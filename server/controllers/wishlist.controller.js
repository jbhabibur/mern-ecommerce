import Wishlist from "../models/Wishlist.js";

// Toggle Product in Wishlist (Add/Remove)
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id; // verifyToken theke asche

    let wishlist = await Wishlist.findOne({ user: userId });

    // 1. Wishlist na thakle notun create koro
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId],
      });
    } else {
      // 2. Product ki agei ache?
      const isExist = wishlist.products.includes(productId);

      if (isExist) {
        // Product thakle remove koro
        wishlist.products = wishlist.products.filter(
          (id) => id.toString() !== productId,
        );
      } else {
        // Product na thakle add koro
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    // Update korar por populate kore pathano jate frontend-e details pawa jay
    const updatedWishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
    );

    res.status(200).json({
      success: true,
      message: "Wishlist updated successfully",
      products: updatedWishlist.products, // Sorasori products array pathachhi
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User's Wishlist
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
