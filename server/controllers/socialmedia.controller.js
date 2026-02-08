import { Storefront } from "../models/storefront.model.js";
import { cloudinary } from "../config/cloudinary.js";
import { asyncHandler } from "../middleware/error.middleware.js";

/**
 * @desc    Get Social Feed
 * @route   GET /api/storefront/social-feed
 */
export const getSocialFeed = asyncHandler(async (req, res) => {
  let storefront = await Storefront.findOne();

  if (!storefront) {
    storefront = await Storefront.create({
      promos: [],
      social_feed: [],
    });

    return res.status(200).json({
      success: true,
      data: [],
    });
  }

  const data = await Storefront.aggregate([
    { $match: { _id: storefront._id } },
    { $unwind: "$social_feed" },
    { $replaceRoot: { newRoot: "$social_feed" } },
    { $sort: { createdAt: -1 } },
  ]);
  console.log(data);

  res.status(200).json({
    success: true,
    count: data.length,
    data: data,
  });
});

/**
 * @desc    Add Social Feed (Multiple Files or Single URL)
 * @route   POST /api/storefront/social-feed
 */
export const addSocialFeed = asyncHandler(async (req, res) => {
  let itemsToAdd = [];

  // 1. Handle Multiple Local Files
  if (req.files && req.files.length > 0) {
    itemsToAdd = req.files.map((file) => ({
      image: {
        url: file.path,
        public_id: file.filename,
      },
    }));
  }
  // 2. Handle Single External URL
  else if (req.body.url) {
    itemsToAdd = [
      {
        image: {
          url: req.body.url,
          public_id: `external_${Date.now()}`,
        },
      },
    ];
  }

  if (itemsToAdd.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No content provided" });
  }

  let storefront = await Storefront.findOne();
  if (!storefront) {
    storefront = await Storefront.create({ social_feed: [] });
  }

  // Push new items to array
  storefront.social_feed.push(...itemsToAdd);
  await storefront.save();

  // Return only the newly added items (supports both array/single object for frontend)
  const addedItems = storefront.social_feed.slice(-itemsToAdd.length);

  res.status(201).json({
    success: true,
    message: "Social feed updated",
    data: addedItems.length === 1 ? addedItems[0] : addedItems,
  });
});

/**
 * @desc    Delete Social Feed Item
 * @route   DELETE /api/storefront/social-feed/:id
 */
export const deleteSocialFeed = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const storefront = await Storefront.findOne();
  if (!storefront) {
    return res
      .status(404)
      .json({ success: false, message: "Storefront not found" });
  }

  const feedItem = storefront.social_feed.id(id);
  if (!feedItem) {
    return res
      .status(404)
      .json({ success: false, message: "Feed item not found" });
  }

  // Delete from Cloudinary if not an external URL
  if (
    feedItem.image?.public_id &&
    !feedItem.image.public_id.startsWith("external_")
  ) {
    await cloudinary.uploader.destroy(feedItem.image.public_id);
  }

  storefront.social_feed.pull(id);
  await storefront.save();

  res.status(200).json({
    success: true,
    message: "Social feed item deleted",
  });
});
