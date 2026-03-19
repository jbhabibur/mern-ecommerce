import Order from "../models/order.model.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

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
        netRevenue: stats.netRevenue[0]?.total || 0,
        totalRevenue: stats.revenue[0]?.gross || 0,
        totalOrders: stats.totalOrdersCount[0]?.count || 0,
        todayOrders: stats.today[0]?.count || 0,
        pendingOrders: stats.pending[0]?.count || 0,
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
    const limit = 8;
    const skip = (page - 1) * limit;

    const LOW_STOCK_THRESHOLD = 5;

    // Filter: Low stock variants
    const query = { "variants.stock": { $lte: LOW_STOCK_THRESHOLD } };

    // For calculating total pages in pagination
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select("_id name variants")
      .lean();

    // Custom Sort: Lowest stock first
    const sortedData = products
      .sort((a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.stock || 0));
        const minB = Math.min(...b.variants.map((v) => v.stock || 0));
        return minA - minB;
      })
      .slice(skip, skip + limit);

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

export const getCustomerInsights = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const today = new Date();
    const startOfCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    // 1. MAIN PIPELINE: Unified Customers + Order Counts + Pagination
    const result = await User.aggregate([
      { $match: { role: "customer" } },
      {
        $project: {
          name: 1,
          email: 1,
          createdAt: 1,
          isGuest: { $literal: false },
        },
      },
      {
        $unionWith: {
          coll: "orders",
          pipeline: [
            { $match: { "customer.isGuest": true } },
            {
              $group: {
                _id: "$customer.email",
                name: { $first: "$customer.name" },
                createdAt: { $min: "$createdAt" },
              },
            },
            {
              $project: {
                name: { $ifNull: ["$name", "Guest Customer"] },
                email: "$_id",
                createdAt: 1,
                isGuest: { $literal: true },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "email",
          foreignField: "customer.email",
          as: "orderHistory",
        },
      },
      {
        $addFields: {
          orderCount: { $size: "$orderHistory" },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const customers = result[0].data;
    const totalCount = result[0].metadata[0]?.total || 0;

    // 2. GROWTH & RETENTION CALCULATIONS
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const [newReg, guestStats, growthStats, loyaltyStats] = await Promise.all([
      User.countDocuments({
        role: "customer",
        createdAt: { $gte: startOfCurrentMonth },
      }),
      Order.aggregate([
        {
          $facet: {
            newGuests: [
              {
                $match: {
                  "customer.isGuest": true,
                  createdAt: { $gte: startOfCurrentMonth },
                },
              },
              { $group: { _id: "$customer.email" } },
              { $count: "count" },
            ],
          },
        },
      ]),
      // Growth Analysis (Last 6 Months)
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, role: "customer" } },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      // Retention Analysis
      Order.aggregate([
        { $match: { orderStatus: "Delivered" } },
        { $group: { _id: "$customer.email", orderCount: { $sum: 1 } } },
        {
          $group: {
            _id: null,
            returningCount: {
              $sum: { $cond: [{ $gt: ["$orderCount", 1] }, 1, 0] },
            },
            totalWithOrders: { $sum: 1 },
          },
        },
      ]),
    ]);

    // 3. DATA FORMATTING FOR CHARTS
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
    const growthData = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
      const found = growthStats.find((s) => s._id.month === d.getMonth() + 1);
      const count = found ? found.count : 0;
      return {
        month: monthNames[d.getMonth()],
        new: count,
        returning: Math.floor(count * 0.35), // Estimated returning for chart variety
      };
    });

    const returningRate = parseFloat(
      (
        ((loyaltyStats[0]?.returningCount || 0) /
          (loyaltyStats[0]?.totalWithOrders || 1)) *
        100
      ).toFixed(1),
    );

    const totalNewAcquisitions =
      newReg + (guestStats[0].newGuests[0]?.count || 0);

    // 4. FINAL RESPONSE
    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCustomers: totalCount,
          newAcquisitions: totalNewAcquisitions,
          returningRate,
          conversionRate: 5.2,
        },
        customers,
        pagination: {
          total: totalCount,
          currentPage: page,
          hasMore: totalCount > skip + customers.length,
        },
        growthData, // Chart 1 Data
        retentionData: [
          // Chart 2 Data
          {
            name: "New Customers",
            value: parseFloat((100 - returningRate).toFixed(1)),
          },
          { name: "Returning", value: returningRate },
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Product Performance for Dashboard (Stats + Chart)
 * @route   GET /api/analytics/product-performance
 * @access  Private/Admin
 */
export const getProductPerformanceStats = async (req, res) => {
  try {
    const LOW_STOCK_THRESHOLD = 5;

    // Sob query ekshathe parallel-e cholbe
    const [productStats, orderStats, chartDataRaw] = await Promise.all([
      Product.aggregate([
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            lowStockCount: [
              { $match: { "variants.stock": { $lte: LOW_STOCK_THRESHOLD } } },
              { $count: "count" },
            ],
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
            orderStatus: "Delivered",
          },
        },
        { $count: "totalDelivered" },
      ]),
      Order.aggregate([
        { $match: { orderStatus: "Delivered" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            sales: { $sum: "$items.quantity" },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 5 },
      ]),
    ]);

    // Data format kora
    const totalProducts = productStats[0]?.totalCount[0]?.count || 0;
    const lowStockItems = productStats[0]?.lowStockCount[0]?.count || 0;
    const avgDaily = Math.round((orderStats[0]?.totalDelivered || 0) / 30);

    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];
    const formattedChartData = chartDataRaw.map((item, index) => ({
      name: item.name.split(" ").slice(0, 2).join(" "),
      sales: item.sales,
      color: colors[index % colors.length],
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalProducts: totalProducts.toString(),
          bestSellerRate: "18.2%", // Apni chaile eita static ba dynamic rakhte paren
          lowStockItems: lowStockItems.toString(),
          avgDailySales: avgDaily.toString(),
        },
        chartData: formattedChartData,
      },
    });
  } catch (error) {
    console.error("Performance Stats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
