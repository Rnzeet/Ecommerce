require('dotenv').config();
const express = require("express");
const adminRoutes = require("./models/admin");

const app = express();
app.use(express.json());

app.use("/admin", adminRoutes); // <- now works because adminRoutes is a router

app.get("/", (req, res) => {
  res.send("MyTeaStore API Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
