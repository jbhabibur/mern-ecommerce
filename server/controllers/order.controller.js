import Order from "../models/order.model.js";
import { emitOrderNotification } from "../utils/orderNotification.utils.js";
import SSLCommerzPayment from "sslcommerz-lts";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  // 1. Log incoming body for debugging
  console.log("Incoming Order Body:", JSON.stringify(req.body, null, 2));

  try {
    const {
      customer,
      items,
      shippingAddress,
      billingAddress,
      financials,
      payment,
    } = req.body;

    // 2. Basic Validation
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items found" });
    }

    // 3. Create Order in Database
    const newOrder = new Order({
      customer,
      items,
      shippingAddress,
      billingAddress,
      financials,
      payment,
      history: [
        {
          status: "Order Placed",
          updatedBy: customer.isGuest ? "guest" : "user",
        },
      ],
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved in DB:", savedOrder._id);

    // Live order saving notification to admin
    emitOrderNotification(savedOrder, "NEW_ORDER");

    // 4. SSLCommerz Logic
    if (payment.method === "ssl") {
      const isLive = process.env.SSL_IS_LIVE === "true";
      const sslcz = new SSLCommerzPayment(
        process.env.SSL_STORE_ID,
        process.env.SSL_STORE_PASS,
        isLive,
      );

      // Mapping logic to prevent 'undefined' errors
      const data = {
        total_amount: financials.totalAmount,
        currency: "BDT",
        tran_id: payment.transactionId,

        success_url: `${process.env.SERVER_URL}/api/payment/success/${payment.transactionId}`,
        fail_url: `${process.env.SERVER_URL}/api/payment/fail/${payment.transactionId}`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${payment.transactionId}`,
        ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,

        shipping_method: "Courier",
        product_name: items
          .map((i) => i.name)
          .join(", ")
          .substring(0, 100),
        product_category: "Clothing",
        product_profile: "general",

        // Customer Details (Handles both 'phone' and 'phoneNumber')
        cus_name: shippingAddress.fullName || "Customer",
        cus_email: customer.email || "test@test.com",
        cus_add1:
          shippingAddress.address || shippingAddress.houseAddress || "Dhaka",
        cus_city: shippingAddress.city || "Dhaka",
        cus_state: shippingAddress.division || "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone:
          shippingAddress.phone || shippingAddress.phoneNumber || "01700000000",

        // Shipping Details (Required by SSLCommerz)
        ship_name: shippingAddress.fullName || "Customer",
        ship_add1:
          shippingAddress.address || shippingAddress.houseAddress || "Dhaka",
        ship_city: shippingAddress.city || "Dhaka",
        ship_state: shippingAddress.division || "Dhaka",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
      };

      console.log("🛠 SSL Initialization Data:", data);

      const apiResponse = await sslcz.init(data);

      if (apiResponse?.GatewayPageURL) {
        console.log("🔗 SSL Gateway URL:", apiResponse.GatewayPageURL);
        return res.status(201).json({
          success: true,
          paymentUrl: apiResponse.GatewayPageURL,
          orderId: savedOrder._id,
        });
      } else {
        console.error("SSL Initialization Failed:", apiResponse);
        return res.status(400).json({
          success: false,
          message: "SSL Session failed",
          error: apiResponse?.failedreason || "Store Credential Error",
        });
      }
    }

    // 5. COD Response
    res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("Order Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Order Details by MongoDB _id
 */
export const getOrderById = async (req, res) => {
  console.log("Request received for ID:", req.params.id);
  try {
    const { id } = req.params;

    // 1. Validate if the 'id' is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID format",
      });
    }

    // 2. Finding the order by its unique ID
    // Note: Mongoose automatically converts the string 'id' into an ObjectId
    const order = await Order.findById(id);

    // 3. If order does not exist in the collection
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found in database",
      });
    }

    // 4. Returning the found order object
    res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Fetch Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Searching for orders with customer.userId:", userId);

    // CHANGE: Query the nested 'customer.userId' field instead of 'user'
    const orders = await Order.find({ "customer.userId": userId }).sort({
      createdAt: -1,
    });

    console.log("Orders found:", orders.length);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders || [],
    });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const retryPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the existing order in the database
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 1. Initialize SSLCommerz (Same logic as createOrder)
    const isLive = process.env.SSL_IS_LIVE === "true";
    const sslcz = new SSLCommerzPayment(
      process.env.SSL_STORE_ID,
      process.env.SSL_STORE_PASS,
      isLive, // true for live, false for sandbox
    );

    // 2. Generate a fresh Transaction ID (SSL requires a unique ID for every attempt)
    const newTranId = `RE${orderId.toString().slice(-4)}${Date.now().toString().slice(-6)}`;

    // 3. Prepare SSLCommerz Data with proper fallbacks to prevent undefined errors
    const data = {
      total_amount: order.financials.totalAmount,
      currency: "BDT",
      tran_id: newTranId,
      success_url: `${process.env.SERVER_URL}/api/payment/success/${newTranId}`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail/${newTranId}`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${newTranId}`,
      ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,

      shipping_method: "Courier",
      product_name: order.items
        .map((i) => i.name)
        .join(", ")
        .substring(0, 100),
      product_category: "Clothing",
      product_profile: "general",

      // Customer Details (Handles both 'phone' and 'phoneNumber' mapping)
      cus_name: order.shippingAddress.fullName || "Customer",
      cus_email: order.customer.email || "test@test.com",
      cus_add1:
        order.shippingAddress.address ||
        order.shippingAddress.houseAddress ||
        "Dhaka",
      cus_city: order.shippingAddress.city || "Dhaka",
      cus_state: order.shippingAddress.division || "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone:
        order.shippingAddress.phone ||
        order.shippingAddress.phoneNumber ||
        "01700000000",

      // Shipping Details (Required by SSLCommerz)
      ship_name: order.shippingAddress.fullName || "Customer",
      ship_add1:
        order.shippingAddress.address ||
        order.shippingAddress.houseAddress ||
        "Dhaka",
      ship_city: order.shippingAddress.city || "Dhaka",
      ship_state: order.shippingAddress.division || "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    console.log("🛠 Retrying SSL Session with Data:", data);

    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      // 4. IMPORTANT: Update the database with the new Transaction ID
      // so the success/fail routes can identify this order attempt
      order.payment.transactionId = newTranId;
      await order.save();

      console.log(
        "🔗 New SSL Gateway URL (Retry):",
        apiResponse.GatewayPageURL,
      );
      return res.status(200).json({
        success: true,
        paymentUrl: apiResponse.GatewayPageURL,
      });
    } else {
      console.error("SSL Retry Failed:", apiResponse);
      return res.status(400).json({
        success: false,
        message: "SSL Session failed",
        error: apiResponse?.failedreason || "Store Credential Error",
      });
    }
  } catch (error) {
    console.error("Retry Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller: Get Orders with Dynamic Limit, Pagination, Search, and Status Filter
 */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    // 1. Get search and status from query params
    const { search, status } = req.query;

    // 2. Build the dynamic query object
    const query = {};

    // Filter by Order Status (e.g., "Shipped", "Delivered")
    if (status && status !== "" && status !== "All") {
      query.orderStatus = status;
    }

    // Search by Customer Name, Phone, or Order ID
    if (search) {
      query.$or = [
        { "billingAddress.fullName": { $regex: search, $options: "i" } },
        { "billingAddress.phoneNumber": { $regex: search, $options: "i" } },
      ];

      // If search term looks like a MongoDB ID, add it to $or
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: search });
      }
    }

    // 3. Get total count based on the filter (Crucial for badge & pagination)
    const totalOrders = await Order.countDocuments(query);

    // 4. Fetch filtered and paginated orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalOrders: totalOrders, // Updates RTK Query badge
      orders: orders || [],
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        hasNextPage: skip + orders.length < totalOrders,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Admin Fetch Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Controller: Update Order (Admin)
 * Updates status and emits a socket event so all admins see the change instantly.
 */
export const updateOrderAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, internalNote, isVerified } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update status and push to audit history
    if (orderStatus) {
      order.orderStatus = orderStatus;

      const adminName =
        `${req.user?.firstName || "Admin"} ${req.user?.lastName || ""}`.trim();

      order.history.push({
        status: orderStatus,
        updatedBy: {
          name: adminName,
          email: req.user?.email || "system@admin.com",
        },
        updatedAt: new Date(),
      });
    }

    if (internalNote !== undefined) order.internalNote = internalNote;
    if (isVerified !== undefined) order.isVerified = isVerified;

    const updatedOrder = await order.save();

    // [REAL-TIME EMIT]
    // This notifies all connected admins about the order update
    try {
      const io = getIO();
      io.emit("orderUpdated", updatedOrder);
    } catch (socketErr) {
      console.error("Socket Emit Error (Update):", socketErr.message);
      // We don't block the response even if socket fails
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Admin Update Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order tracking details by ID
// @route   GET /api/orders/track/:orderId
// @access  Public
export const getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Database theke order find kora
    const order = await Order.findById(orderId).select(
      "orderStatus shippingAddress history createdAt",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Frontend er tracking steps er sathe match koranor jonno status normalize kora
    const formattedOrder = {
      _id: order._id,
      // "Order Placed" -> "ORDER PLACED"
      status: order.orderStatus.toUpperCase(),
      shippingAddress: {
        city: order.shippingAddress.city,
      },
      history: order.history,
      createdAt: order.createdAt,
    };

    return res.status(200).json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error("Tracking Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
