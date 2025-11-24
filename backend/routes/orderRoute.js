const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const { getAllOrders } = require("../controllers/orderController");

const adminMiddleware = require("../middlewares/adminMiddleware");

// USER
router.post("/create", auth, createOrder);
router.get("/myorders", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

router.get("/", auth, adminMiddleware, getAllOrders);

router.patch("/:id/status", auth, adminMiddleware, updateOrderStatus);

module.exports = router;
