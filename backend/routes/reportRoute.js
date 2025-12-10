const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const adminAuth = require("../middlewares/adminAuth");
const {
  reportPost,
  getPendingReports,
  getAllReports,
  resolveReport,
} = require("../controllers/reportController");

// Report routes
router.post("/", userAuth, reportPost);
router.get("/pending", adminAuth, getPendingReports);
router.get("/all", adminAuth, getAllReports);
router.patch("/:reportId", adminAuth, resolveReport);

module.exports = router;
