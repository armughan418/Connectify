const User = require("../models/user");
let Post = null;
let Comment = null;
let Report = null;

try {
  Post = require("../models/Post");
} catch (e) {
  console.warn("Post model not found");
}

try {
  Comment = require("../models/Comment");
} catch (e) {
  console.warn("Comment model not found");
}

try {
  Report = require("../models/Report");
} catch (e) {
  console.warn("Report model not found");
}

const getAdminStats = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ status: false, message: "Admins only" });
    }

    const totalUsers = await User.countDocuments();
    const totalPosts = Post ? await Post.countDocuments() : 0;
    const totalComments = Comment ? await Comment.countDocuments() : 0;
    const totalReports = Report
      ? await Report.countDocuments({ status: "pending" })
      : 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const newPostsToday = Post
      ? await Post.countDocuments({
          createdAt: { $gte: startOfDay },
        })
      : 0;

    let postsByCategory = {};
    if (Post) {
      const postsCategoryAgg = await Post.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);
      postsCategoryAgg.forEach((c) => (postsByCategory[c._id] = c.count));
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    let monthlyPostsAgg = [];
    if (Post) {
      monthlyPostsAgg = await Post.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            posts: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
    }

    res.json({
      status: true,
      data: {
        totals: {
          totalUsers,
          totalPosts,
          totalComments,
          totalReports,
        },
        today: {
          newUsersToday,
          newPostsToday,
        },
        postsByCategory,
        monthly: {
          newUsers: monthlyAgg,
          posts: monthlyPostsAgg,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Admin access required" });
    }

    const users = await User.find(
      {},
      "name email role phone address createdAt profilePhoto"
    );
    res.json({ status: true, users });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Admin access required" });
    }

    const { name, role } = req.body;

    if (!name || name.length < 3)
      return res
        .status(400)
        .json({ status: false, message: "Name must be at least 3 characters" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });

    user.name = name;
    if (role && ["user", "admin"].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.json({
      status: true,
      user,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Admin access required" });
    }

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });

    await user.deleteOne();
    res.json({ status: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
};
