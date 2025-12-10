const User = require("../models/user");

const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    if (!friendId) {
      return res
        .status(400)
        .json({ status: false, message: "Friend ID is required" });
    }

    if (friendId === userId) {
      return res
        .status(400)
        .json({ status: false, message: "Cannot add yourself as friend" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.friends.includes(friendId)) {
      return res
        .status(400)
        .json({ status: false, message: "Already friends with this user" });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.status(200).json({
      status: true,
      message: "Friend added successfully",
      data: { friendId },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    if (!friendId) {
      return res
        .status(400)
        .json({ status: false, message: "Friend ID is required" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({
      status: true,
      message: "Friend removed successfully",
      data: { friendId },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate(
      "friends",
      "name email phone"
    );

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({
      status: true,
      message: "Friends list retrieved",
      data: { friends: user.friends },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const areFriends = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isFriend = user.friends.includes(friendId);

    res.status(200).json({
      status: true,
      message: "Friendship status retrieved",
      data: { isFriend },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  addFriend,
  removeFriend,
  getFriends,
  areFriends,
};
