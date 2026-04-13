
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./models/auth");

const app = express();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("MyTeaStore API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
