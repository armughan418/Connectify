const Order = require("../models/order");

const getAdminStats = async (req, res) => {
  try {
    if (!req.user || (!req.user.isAdmin && req.user.role !== "admin"))
      return res.status(403).json({ status: false, message: "Admins only" });

    const totals = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const ordersByStatusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const ordersByStatus = {};
    ordersByStatusAgg.forEach((r) => (ordersByStatus[r._id] = r.count));

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      {
        $group: {
          _id: null,
          todayOrders: { $sum: 1 },
          todayRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      status: true,
      data: {
        totals: totals[0] || { totalOrders: 0, totalRevenue: 0 },
        ordersByStatus,
        todayOrders: todayAgg[0]?.todayOrders || 0,
        todayRevenue: todayAgg[0]?.todayRevenue || 0,
        monthly: monthlyAgg,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  getAdminStats,
};
