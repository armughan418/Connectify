const Post = require("../models/Post");
const User = require("../models/user");
const Comment = require("../models/Comment");

// Create post
const createPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const { content, category, image, video } = req.body;
    const userId = req.user.id || req.user._id;

    if (!userId) {
      console.error("User ID missing in token:", req.user);
      return res.status(401).json({
        status: false,
        message: "User ID not found in token. Please login again.",
      });
    }

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Post content is required" });
    }

    const validCategories = ["general", "tech", "life", "other"];
    const postCategory = validCategories.includes(category)
      ? category
      : "general";

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        status: false,
        message: "User not found. Please login again.",
      });
    }

    const post = new Post({
      author: userId,
      content: content.trim(),
      category: postCategory,
      image: image || null,
      video: video || null,
    });

    await post.save();

    try {
      await post.populate("author", "name email profilePhoto");
    } catch (populateError) {
      console.error("Populate error (non-fatal):", populateError);
    }

    res.status(201).json({
      status: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    console.error("Error Details:", {
      message: error.message,
      name: error.name,
      userId: req.user?.id || req.user?._id,
      body: req.body,
    });

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: false,
        message: `Validation error: ${error.message}`,
      });
    }

    res.status(500).json({
      status: false,
      message: error.message || "Failed to create post",
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "name email profilePhoto")
      .populate("likes", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });
        const postObj = post.toObject();
        postObj.commentsCount = commentsCount;
        return postObj;
      })
    );

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      status: true,
      message: "Posts retrieved successfully",
      data: postsWithCommentsCount,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get All Posts Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("author", "name email profilePhoto")
      .populate("likes", "name email");

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    res.status(200).json({
      status: true,
      message: "Post retrieved successfully",
      data: { post },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, category, image, video } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Only post author can update it",
      });
    }

    if (content) post.content = content.trim();
    if (category) post.category = category;
    if (image !== undefined) post.image = image;
    if (video !== undefined) post.video = video;

    await post.save();
    await post.populate("author", "name email");

    res.status(200).json({
      status: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "Only post author can delete it",
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      status: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Already liked this post" });
    }

    post.likes.push(userId);
    post.likesCount = post.likes.length;
    await post.save();

    res.status(200).json({
      status: true,
      message: "Post liked successfully",
      data: { likesCount: post.likesCount },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Unlike post
const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "You have not liked this post" });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    post.likesCount = post.likes.length;
    await post.save();

    res.status(200).json({
      status: true,
      message: "Post unliked successfully",
      data: { likesCount: post.likesCount },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};
