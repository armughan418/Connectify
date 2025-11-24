const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const {
  getProductReviews,
  addReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/:productId", getProductReviews);

router.post("/:productId", auth, addReview);

router.delete("/:reviewId", auth, admin, deleteReview);

module.exports = router;
