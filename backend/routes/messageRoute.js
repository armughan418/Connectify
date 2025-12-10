const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const {
  sendMessage,
  getMessages,
  getConversations,
  getUnreadCount,
} = require("../controllers/messageController");

// Message routes - order matters for Express routing (specific routes before parameterized routes)
router.post("/send", userAuth, sendMessage);
router.get("/unread/count", userAuth, getUnreadCount);
router.get("/conversations", userAuth, getConversations);
router.get("/:friendId", userAuth, getMessages);

module.exports = router;
