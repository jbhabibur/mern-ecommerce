import Order from "../models/order.model.js";
import Product from "../models/Product.js";

/**
 * Controller: Get Top 5 Performing Items with Real-time Stock
 */
export const getTopPerformingItems = async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      // 1. Filter only delivered orders
      { $match: { orderStatus: "Delivered" } },

      // 2. Unwind items array
      { $unwind: "$items" },

      // 3. Group by productId and sum quantities
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          totalUnitsSold: { $sum: "$items.quantity" },
        },
      },

      // 4. Join with Product collection
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // 5. Unwind product details
      { $unwind: "$productDetails" },

      // 6. Project final fields and calculate total stock from variants array
      {
        $project: {
          _id: 1,
          name: 1,
          unitsSold: "$totalUnitsSold",
          // Sum the stock from all variant objects in the array
          stock: { $sum: "$productDetails.variants.stock" },
        },
      },

      // 7. Sort by performance and limit results
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: topItems,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller: getKpiStats
 * Purpose: Fetch all essential business metrics for Dashboard KPI cards.
 */
// export const getKpiStats = async (req, res) => {
//   try {
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);

//     const kpiData = await Order.aggregate([
//       {
//         $facet: {
//           // --- REVENUE STATS ---
//           revenue: [
//             {
//               $group: { _id: null, gross: { $sum: "$financials.totalAmount" } },
//             },
//           ],
//           // --- ORDER COUNTS ---
//           today: [
//             { $match: { createdAt: { $gte: todayStart } } },
//             { $count: "count" },
//           ],
//           // Using $in to capture both "Order Placed" and "Pending" as pending
//           pending: [
//             {
//               $match: {
//                 orderStatus: { $in: ["Order Placed", "Pending"] },
//               },
//             },
//             { $count: "count" },
//           ],
//           delivered: [
//             { $match: { orderStatus: "Delivered" } },
//             { $count: "count" },
//           ],
//         },
//       },
//     ]);

//     const stats = kpiData[0];

//     res.status(200).json({
//       success: true,
//       data: {
//         totalRevenue: stats.revenue[0]?.gross || 0,
//         todayOrders: stats.today[0]?.count || 0,
//         pendingOrders: stats.pending[0]?.count || 0, // Matches the 'pending' facet key
//         deliveredOrders: stats.delivered[0]?.count || 0,
//       },
//     });
//   } catch (error) {
//     console.error("KPI Stats Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const getKpiStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const kpiData = await Order.aggregate([
      {
        $facet: {
          // --- TOTAL REVENUE (All time gross) ---
          revenue: [
            {
              $group: { _id: null, gross: { $sum: "$financials.totalAmount" } },
            },
          ],
          // --- NET REVENUE (Only Delivered Orders) ---
          netRevenue: [
            { $match: { orderStatus: "Delivered" } },
            {
              $group: { _id: null, total: { $sum: "$financials.totalAmount" } },
            },
          ],
          // --- TOTAL ORDER COUNT ---
          totalOrdersCount: [{ $count: "count" }],
          // --- TODAY'S ORDERS ---
          today: [
            { $match: { createdAt: { $gte: todayStart } } },
            { $count: "count" },
          ],
          // --- PENDING ORDERS ---
          pending: [
            {
              $match: {
                orderStatus: { $in: ["Order Placed", "Pending"] },
              },
            },
            { $count: "count" },
          ],
          // --- DELIVERED ORDERS COUNT ---
          delivered: [
            { $match: { orderStatus: "Delivered" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const stats = kpiData[0];

    res.status(200).json({
      success: true,
      data: {
        // Ashol income
        netRevenue: stats.netRevenue[0]?.total || 0,
        // Mot takar order (Gross)
        totalRevenue: stats.revenue[0]?.gross || 0,
        // Mot koyti order
        totalOrders: stats.totalOrdersCount[0]?.count || 0,
        // Aajker order count
        todayOrders: stats.today[0]?.count || 0,
        // Pending order count
        pendingOrders: stats.pending[0]?.count || 0,
        // Delivered order count
        deliveredOrders: stats.delivered[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("KPI Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get only products that have at least one low stock variant
 * @route   GET /api/products/admin/stock-analysis
 * @access  Admin / Private
 */

export const getStockAnalysis = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8; // Proti page-e 8 ta item
    const skip = (page - 1) * limit;

    const LOW_STOCK_THRESHOLD = 5;

    // Filter: Jei variant gulo low stock segulo khujbe
    const query = { "variants.stock": { $lte: LOW_STOCK_THRESHOLD } };

    // Total count pagination-er total pages calculation er jonyo
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select("_id name variants")
      .lean();

    // Custom Sort: Sobcheye kom stock thaka product sobar upore
    const sortedData = products
      .sort((a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.stock || 0));
        const minB = Math.min(...b.variants.map((v) => v.stock || 0));
        return minA - minB;
      })
      .slice(skip, skip + limit); // Pagination apply sorting-er por

    const formattedData = sortedData.map((product) => ({
      id: product._id,
      name: product.name,
      totalCapacity: 50,
      totalStock: product.variants.reduce((acc, v) => acc + (v.stock || 0), 0),
      variants: product.variants.map((v) => ({
        size: v.size,
        stock: v.stock,
      })),
    }));

    res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get monthly revenue statistics (Gross vs Net) for the last 12 months
 * @route   GET /api/analytics/monthly-revenue-stats
 * @access  Private/Admin
 */
export const getMonthlyRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    // Start from 11 months ago
    const twelveMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      1,
    );

    const monthlyData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$createdAt" } },
            month: { $month: { $toDate: "$createdAt" } },
          },
          totalRevenue: { $sum: "$financials.totalAmount" },
          netRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$orderStatus", "Delivered"] },
                "$financials.totalAmount",
                0,
              ],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Map existing data for quick lookup
    const statsMap = new Map(
      monthlyData.map((item) => [`${item._id.year}-${item._id.month}`, item]),
    );

    const formattedData = [];

    // Generate last 12 months dynamically to fill missing months with zero
    for (let i = 0; i < 12; i++) {
      const d = new Date(
        twelveMonthsAgo.getFullYear(),
        twelveMonthsAgo.getMonth() + i,
        1,
      );
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${month}`;

      const existingData = statsMap.get(key);

      formattedData.push({
        // Format: July, 25
        month: `${monthNames[month - 1]}, ${year.toString().slice(-2)}`,
        totalRevenue: existingData ? existingData.totalRevenue : 0,
        netRevenue: existingData ? existingData.netRevenue : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Revenue Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
