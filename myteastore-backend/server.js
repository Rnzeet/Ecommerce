
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./models/auth");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://ecommerce-46mx.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("MyTeaStore API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
