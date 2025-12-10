const Comment = require("../models/Comment");
const Post = require("../models/Post");

const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user.id;

    if (!postId) {
      return res
        .status(400)
        .json({ status: false, message: "Post ID is required" });
    }

    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Comment content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    const comment = new Comment({
      postId,
      author: userId,
      content: content.trim(),
    });

    await comment.save();
    await comment.populate("author", "name email profilePhoto");

    res.status(201).json({
      status: true,
      message: "Comment created successfully",
      data: { comment },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    const comments = await Comment.find({ postId })
      .populate("author", "name email profilePhoto")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalComments = await Comment.countDocuments({ postId });

    res.status(200).json({
      status: true,
      message: "Comments retrieved successfully",
      data: {
        comments,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId).populate(
      "author",
      "name email profilePhoto"
    );

    if (!comment) {
      return res
        .status(404)
        .json({ status: false, message: "Comment not found" });
    }

    res.status(200).json({
      status: true,
      message: "Comment retrieved successfully",
      data: { comment },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ status: false, message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Only comment author can update it",
      });
    }

    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Comment content is required" });
    }

    comment.content = content.trim();
    await comment.save();
    await comment.populate("author", "name email profilePhoto");

    res.status(200).json({
      status: true,
      message: "Comment updated successfully",
      data: { comment },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res
        .status(404)
        .json({ status: false, message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Only comment author can delete it",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      status: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
};
