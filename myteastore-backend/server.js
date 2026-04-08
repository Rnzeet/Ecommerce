
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./models/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("MyTeaStore API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
