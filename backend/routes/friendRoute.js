const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");
const {
  addFriend,
  removeFriend,
  getFriends,
  areFriends,
} = require("../controllers/friendController");

// Friend routes
router.post("/add", userAuth, addFriend);
router.post("/remove", userAuth, removeFriend);
router.get("/list", userAuth, getFriends);
router.get("/check/:friendId", userAuth, areFriends);

module.exports = router;
