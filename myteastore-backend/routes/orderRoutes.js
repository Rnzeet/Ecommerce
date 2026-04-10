const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/create  — create a Razorpay order
router.post("/create", async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(parseFloat(amount) * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ message: err.message || "Failed to create order" });
  }
});

// POST /api/orders/verify  — verify Razorpay payment signature
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment fields" });
  }
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, paymentId: razorpay_payment_id });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});

module.exports = router;
