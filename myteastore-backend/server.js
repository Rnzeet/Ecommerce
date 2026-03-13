
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const adminRoutes = require("./models/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("MyTeaStore API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
