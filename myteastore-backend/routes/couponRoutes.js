const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

// One-time coupons — checked against DB per user
const ONE_TIME_COUPONS = {
  NEW10: { discount: 0.10, label: "10% off for new users" },
};

// POST /api/coupons/validate
router.post("/validate", async (req, res) => {
  try {
    const { code, userEmail } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: "No coupon code provided" });

    const upper = code.trim().toUpperCase();

    if (ONE_TIME_COUPONS[upper]) {
      if (!userEmail) return res.status(400).json({ valid: false, message: "Login required to use this coupon" });

      // Check if coupon already used
      const { data: existing } = await supabase
        .from("coupon_usage")
        .select("id")
        .eq("coupon_code", upper)
        .eq("user_email", userEmail.toLowerCase())
        .maybeSingle();

      if (existing) {
        return res.json({ valid: false, message: "You have already used this coupon" });
      }

      // Check if user has already placed any order
      const { data: priorOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("customer_email", userEmail.toLowerCase())
        .limit(1)
        .maybeSingle();

      if (priorOrder) {
        return res.json({ valid: false, message: "NEW10 is only for first-time orders" });
      }

      return res.json({ valid: true, discount: ONE_TIME_COUPONS[upper].discount, code: upper });
    }

    return res.json({ valid: false, message: "Invalid coupon code" });
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

// POST /api/coupons/mark-used  (called after successful payment)
router.post("/mark-used", async (req, res) => {
  try {
    const { code, userEmail } = req.body;
    if (!code || !userEmail) return res.status(400).json({ message: "code and userEmail required" });

    const upper = code.trim().toUpperCase();
    if (!ONE_TIME_COUPONS[upper]) return res.json({ skipped: true }); // static coupons don't need recording

    await supabase.from("coupon_usage").insert([{
      coupon_code: upper,
      user_email: userEmail.toLowerCase(),
    }]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
