// server.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// ✅ SERVE STATIC FILES (VERY IMPORTANT)
app.use(express.static(path.join(__dirname)));

// ✅ OPTIONAL ROOT FIX (SAFE)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const specialDays = require("./specialDaysData");

// =============================
// API: GET SPECIAL DAYS
// =============================
app.get("/special-days", (req, res) => {
  res.json(specialDays);
});
app.get("/test", (req, res) => {
  res.send("Server working");
});
// =============================
// START SERVER
// =============================
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});