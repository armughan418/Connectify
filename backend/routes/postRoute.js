const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/postController");

// Post routes
router.post("/create", userAuth, createPost);
router.get("/all", getAllPosts);
router.get("/:postId", getPostById);
router.put("/:postId/update", userAuth, updatePost);
router.delete("/:postId/delete", userAuth, deletePost);
router.post("/:postId/like", userAuth, likePost);
router.post("/:postId/unlike", userAuth, unlikePost);

module.exports = router;
