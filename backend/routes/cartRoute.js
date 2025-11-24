const express = require("express");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController.js");
const auth = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.patch("/update", auth, updateCartItem);
router.delete("/remove/:productId", auth, removeFromCart);

module.exports = router;
