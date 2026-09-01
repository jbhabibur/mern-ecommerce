import Order from "../models/order.model.js";

// @desc    Handle successful payment
// @route   POST /api/payment/success/:tranId
// @access  Public
export const paymentSuccess = async (req, res) => {
  try {
    const { tranId } = req.params;

    // SSLCommerz sends payment details in the request body
    const paymentDetails = req.body;

    // Find the order and update status based on your Mongoose Schema
    const updatedOrder = await Order.findOneAndUpdate(
      { "payment.transactionId": tranId },
      {
        $set: {
          "payment.status": "paid",
          "payment.val_id": paymentDetails.val_id, // Validation ID from SSL
          "payment.bankTranId": paymentDetails.bank_tran_id,
          "payment.cardType": paymentDetails.card_type,
          "payment.paymentDate": new Date(),
          orderStatus: "Processing", // Move from 'Order Placed' to 'Processing'
        },
        // Add an audit trail entry to the history array
        $push: {
          history: {
            status: "Paid via SSLCommerz",
            updatedAt: Date.now(),
            updatedBy: "system",
          },
        },
      },
      { new: true },
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .redirect(`${process.env.CLIENT_URL}/order/fail/${tranId}`);
    }

    // Redirect user to the Frontend Success Page
    // Use environment variable for the frontend URL (e.g., http://localhost:5173)
    res.redirect(`${process.env.CLIENT_URL}/order/success/${tranId}`);
  } catch (error) {
    console.error("Payment Success Error:", error);
    res.redirect(`${process.env.CLIENT_URL}/order/fail/${req.params.tranId}`);
  }
};

// @desc    Handle failed payment
// @route   POST /api/payment/fail/:tranId
// @access  Public
export const paymentFail = async (req, res) => {
  const { tranId } = req.params;

  try {
    // Update order status to failed in DB
    await Order.findOneAndUpdate(
      { "payment.transactionId": tranId },
      {
        $set: { "payment.status": "failed" },
        $push: { history: { status: "Payment Failed", updatedBy: "system" } },
      },
    );
  } catch (error) {
    console.error("Payment Fail Update Error:", error);
  }

  res.redirect(`${process.env.CLIENT_URL}/order/fail/${tranId}`);
};

// @desc    Handle cancelled payment
// @route   POST /api/payment/cancel/:tranId
// @access  Public
export const paymentCancel = async (req, res) => {
  const { tranId } = req.params;

  await Order.findOneAndUpdate(
    { "payment.transactionId": tranId },
    { $set: { "payment.status": "cancelled" } },
  );

  res.redirect(`${process.env.CLIENT_URL}/order/cancel/${tranId}`);
};
