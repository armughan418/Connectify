const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

// Comment routes
router.post("/create", userAuth, createComment);
router.get("/post/:postId", getCommentsByPost);
router.get("/:commentId", getCommentById);
router.put("/:commentId/update", userAuth, updateComment);
router.delete("/:commentId/delete", userAuth, deleteComment);

module.exports = router;
