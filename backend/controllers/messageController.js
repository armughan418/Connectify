const Message = require("../models/Message");
const User = require("../models/user");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, attachment } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res
        .status(400)
        .json({ status: false, message: "Receiver ID is required" });
    }

    if ((!content || content.trim().length === 0) && !attachment) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Message content or attachment is required",
        });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res
        .status(404)
        .json({ status: false, message: "Receiver not found" });
    }

    if (!sender.friends.includes(receiverId)) {
      return res.status(403).json({
        status: false,
        message: "You can only message friends",
      });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content:
        (content && content.trim()) || (attachment ? "📎 Attachment" : ""),
      ...(attachment ? { attachment } : {}),
    });

    await message.save();
    await message.populate([
      { path: "sender", select: "name email profilePhoto" },
      { path: "receiver", select: "name email profilePhoto" },
    ]);

    res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: { message },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const friend = await User.findById(friendId);
    if (!friend) {
      return res
        .status(404)
        .json({ status: false, message: "Friend not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    })
      .populate([
        { path: "sender", select: "name email profilePhoto" },
        { path: "receiver", select: "name email profilePhoto" },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    });

    await Message.updateMany(
      { receiver: userId, sender: friendId, read: false },
      { read: true }
    );

    res.status(200).json({
      status: true,
      message: "Messages retrieved successfully",
      data: {
        messages: messages.reverse(),
        totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const mongoose = require("mongoose");
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userObjectId }, { receiver: userObjectId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userObjectId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "friend",
        },
      },
      {
        $unwind: {
          path: "$friend",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          friendId: "$_id",
          friendName: "$friend.name",
          friendEmail: "$friend.email",
          friendProfilePhoto: "$friend.profilePhoto",
          lastMessage: "$lastMessage.content",
          lastMessageTime: "$lastMessage.createdAt",
          unreadCount: {
            $cond: [
              { $eq: ["$lastMessage.receiver", userObjectId] },
              { $cond: [{ $ifNull: ["$lastMessage.read", false] }, 0, 1] },
              0,
            ],
          },
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    res.status(200).json({
      status: true,
      message: "Conversations retrieved successfully",
      data: { conversations },
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      read: false,
    });

    res.status(200).json({
      status: true,
      message: "Unread count retrieved successfully",
      data: { unreadCount },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  getUnreadCount,
};
