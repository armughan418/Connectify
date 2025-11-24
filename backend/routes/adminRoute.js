const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

// ----------------------
// GET ADMIN STATS
// ----------------------
router.get("/stats", auth, admin, async (req, res) => {
  try {
    // Basic counts
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Total sales
    const orders = await Order.find().populate("items.product");
    const totalSales = orders.reduce((acc, order) => {
      return acc + (order.totalPrice || 0);
    }, 0);

    // Orders by status (dynamic)
    const ordersByStatusAgg = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const ordersByStatus = {};
    ordersByStatusAgg.forEach((r) => (ordersByStatus[r._id] = r.count));

    // Top 5 products by quantity sold
    const productSalesMap = {};
    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          // Handle both populated and non-populated product
          const productId = item.product?._id 
            ? item.product._id.toString() 
            : item.product?.toString() || item.product;
          
          if (productId) {
            productSalesMap[productId] =
              (productSalesMap[productId] || 0) + (item.quantity || 0);
          }
        });
      }
    });

    const topProducts = Object.entries(productSalesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topProductsDetailed = await Promise.all(
      topProducts.map(async ([productId, qty]) => {
        try {
          const product = await Product.findById(productId);
          return {
            id: productId,
            name: product ? product.name : "Deleted Product",
            quantitySold: qty || 0,
          };
        } catch (error) {
          return {
            id: productId,
            name: "Deleted Product",
            quantitySold: qty || 0,
          };
        }
      })
    );

    res.json({
      status: true,
      totalOrders,
      totalUsers,
      totalProducts,
      totalSales,
      ordersByStatus, // dynamic statuses
      topProducts: topProductsDetailed,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
