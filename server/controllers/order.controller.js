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
