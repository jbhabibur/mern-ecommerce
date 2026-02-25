import Order from "../models/order.model.js";
import SSLCommerzPayment from "sslcommerz-lts";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      shippingAddress,
      billingAddress,
      financials,
      payment,
    } = req.body;

    // 1. Basic Validation
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items found" });
    }

    // 2. Create Order in Database (Always save the order first)
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

    // 3. SSLCommerz Logic
    if (payment.method === "ssl") {
      const sslcz = new SSLCommerzPayment(
        process.env.SSL_STORE_ID, // Matches your .env
        process.env.SSL_STORE_PASS, // Matches your .env
        false, // Sandbox mode
      );

      const data = {
        total_amount: financials.totalAmount,
        currency: "BDT",
        tran_id: payment.transactionId,
        success_url: `${process.env.SERVER_URL}/api/payment/success/${payment.transactionId}`,
        fail_url: `${process.env.SERVER_URL}/api/payment/fail/${payment.transactionId}`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${payment.transactionId}`,
        ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
        shipping_method: "Courier",
        product_name: items.map((i) => i.name).join(", "),
        product_category: "Clothing",
        product_profile: "general",
        cus_name: shippingAddress.fullName,
        cus_email: customer.email,
        cus_add1: shippingAddress.houseAddress, // SSL requires address fields
        cus_city: shippingAddress.city,
        cus_state: shippingAddress.division,
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: shippingAddress.phoneNumber,
        ship_name: shippingAddress.fullName,
        ship_add1: shippingAddress.houseAddress,
        ship_city: shippingAddress.city,
        ship_state: shippingAddress.division,
        ship_postcode: "1000",
        ship_country: "Bangladesh",
      };

      const apiResponse = await sslcz.init(data);

      if (apiResponse?.GatewayPageURL) {
        return res.status(201).json({
          success: true,
          paymentUrl: apiResponse.GatewayPageURL,
          orderId: savedOrder._id,
        });
      } else {
        // If SSL fails, we return the error from SSLCommerz
        return res.status(400).json({
          success: false,
          message: "SSL Session failed",
          error: apiResponse?.failedreason,
        });
      }
    }

    // 4. COD Response
    res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("Order Error:", error);
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
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // 1. Initialize SSLCommerz EXACTLY like your createOrder
    const sslcz = new SSLCommerzPayment(
      process.env.SSL_STORE_ID,
      process.env.SSL_STORE_PASS,
      false, // Hardcoded 'false' just like in your createOrder
    );

    // 2. Generate a fresh Transaction ID (SSL requires a unique one for every attempt)
    const newTranId = `RE${orderId.toString().slice(-4)}${Date.now().toString().slice(-6)}`;

    // 3. Fallback for rootUrl since SERVER_URL is missing in your .env
    const rootUrl = process.env.SERVER_URL || "http://localhost:5000";

    const data = {
      total_amount: order.financials.totalAmount,
      currency: "BDT",
      tran_id: newTranId,
      success_url: `${rootUrl}/api/payment/success/${newTranId}`,
      fail_url: `${rootUrl}/api/payment/fail/${newTranId}`,
      cancel_url: `${rootUrl}/api/payment/cancel/${newTranId}`,
      ipn_url: `${rootUrl}/api/payment/ipn`,
      shipping_method: "Courier",
      product_name: order.items
        .map((i) => i.name)
        .join(", ")
        .substring(0, 100),
      product_category: "Clothing",
      product_profile: "general",
      cus_name: order.shippingAddress.fullName || "Customer",
      cus_email: order.customer.email || "test@test.com",
      cus_add1: order.shippingAddress.houseAddress || "Dhaka",
      cus_city: order.shippingAddress.city || "Dhaka",
      cus_state: order.shippingAddress.division || "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: order.shippingAddress.phoneNumber || "01700000000",
      ship_name: order.shippingAddress.fullName,
      ship_add1: order.shippingAddress.houseAddress,
      ship_city: order.shippingAddress.city,
      ship_state: order.shippingAddress.division,
      ship_postcode: "1000",
      ship_country: "Bangladesh",
    };

    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      // IMPORTANT: You MUST update the database with the newTranId
      // Otherwise, the success/fail routes won't find the order.
      order.payment.transactionId = newTranId;
      await order.save();

      return res.status(200).json({
        success: true,
        paymentUrl: apiResponse.GatewayPageURL,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: apiResponse?.failedreason || "SSL Session failed",
      });
    }
  } catch (error) {
    console.error("Retry Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
