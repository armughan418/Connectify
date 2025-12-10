const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const { getAdminStats } = require("../controllers/adminController");

// ----------------------
// GET ADMIN STATS
// ----------------------
router.get("/stats", adminAuth, getAdminStats);

module.exports = router;
