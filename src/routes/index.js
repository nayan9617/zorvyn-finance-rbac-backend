const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const recordRoutes = require("./recordRoutes");
const summaryRoutes = require("./summaryRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/records", recordRoutes);
router.use("/summary", summaryRoutes);

module.exports = router;
