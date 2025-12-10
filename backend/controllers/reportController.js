const Report = require("../models/Report");
const Post = require("../models/Post");
const User = require("../models/user");

const reportPost = async (req, res) => {
  try {
    const { postId, reason } = req.body;
    const userId = req.user.id;

    if (!postId) {
      return res
        .status(400)
        .json({ status: false, message: "Post ID is required" });
    }

    if (!reason) {
      return res
        .status(400)
        .json({ status: false, message: "Reason is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    const existingReport = await Report.findOne({
      postId,
      reportedBy: userId,
      status: "pending",
    });

    if (existingReport) {
      return res.status(400).json({
        status: false,
        message: "You have already reported this post",
      });
    }

    const report = new Report({
      postId,
      reportedBy: userId,
      reason,
    });

    await report.save();
    await report.populate([
      { path: "postId" },
      { path: "reportedBy", select: "name email" },
    ]);

    res.status(201).json({
      status: true,
      message: "Post reported successfully",
      data: { report },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getPendingReports = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Admin access required" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reports = await Report.find({ status: "pending" })
      .populate([
        { path: "postId", select: "content author" },
        { path: "reportedBy", select: "name email" },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReports = await Report.countDocuments({ status: "pending" });

    res.status(200).json({
      status: true,
      message: "Reports retrieved successfully",
      data: {
        reports,
        totalReports,
        totalPages: Math.ceil(totalReports / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Admin access required" });
    }

    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate([
        { path: "postId", select: "content author" },
        { path: "reportedBy", select: "name email" },
        { path: "resolvedBy", select: "name email" },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReports = await Report.countDocuments(query);

    res.status(200).json({
      status: true,
      message: "Reports retrieved successfully",
      data: {
        reports,
        totalReports,
        totalPages: Math.ceil(totalReports / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, notes } = req.body;
    const adminId = req.user.id;

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ status: false, message: "Admin access required" });
    }

    if (!action || !["resolved", "dismissed"].includes(action)) {
      return res.status(400).json({
        status: false,
        message: "Action must be 'resolved' or 'dismissed'",
      });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res
        .status(404)
        .json({ status: false, message: "Report not found" });
    }

    report.status = action;
    report.resolvedBy = adminId;
    report.resolutionNotes = notes || null;

    if (action === "resolved") {
      await Post.findByIdAndDelete(report.postId);
    }

    await report.save();
    await report.populate([
      { path: "postId" },
      { path: "reportedBy", select: "name email" },
      { path: "resolvedBy", select: "name email" },
    ]);

    res.status(200).json({
      status: true,
      message: `Report ${action} successfully`,
      data: { report },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  reportPost,
  getPendingReports,
  getAllReports,
  resolveReport,
};
