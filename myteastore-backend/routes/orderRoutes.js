const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { supabaseAdmin } = require("../config/supabase");

// GET /api/orders/my?email=xxx  — list orders for a specific user
router.get("/my", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders  — list all orders for admin dashboard
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status  — update order status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const VALID = ["paid", "received", "packed", "dispatched", "delivered"];
  if (!status || !VALID.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Valid: ${VALID.join(", ")}` });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/create  — create a Razorpay order
router.post("/create", async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount" });
  }
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ message: "Razorpay keys not configured on server" });
  }
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
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

// POST /api/orders/verify  — verify Razorpay payment signature and save order
router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id, razorpay_payment_id, razorpay_signature,
    customerInfo, items, totalAmount,
  } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing payment fields" });
  }
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }

  // Save order to Supabase (best-effort — don't fail payment if DB insert fails)
  try {
    await supabaseAdmin.from("orders").insert({
      razorpay_order_id,
      razorpay_payment_id,
      customer_name: customerInfo?.name || null,
      customer_email: customerInfo?.email || null,
      customer_phone: customerInfo?.phone || null,
      delivery_address: customerInfo?.address
        ? `${customerInfo.address}, ${customerInfo.city || ""}, ${customerInfo.state || ""} - ${customerInfo.pincode || ""}`.replace(/, ,/g, ",").trim()
        : null,
      items: items || [],
      total_amount: totalAmount || 0,
      status: "paid",
    });
  } catch (dbErr) {
    console.error("Order DB save failed (non-fatal):", dbErr.message);
  }

  res.json({ success: true, paymentId: razorpay_payment_id });
});

module.exports = router;
