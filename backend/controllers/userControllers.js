const User = require("../models/user");

const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });
    res.json({ status: true, user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address, profilePhoto, coverPhoto } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
    if (coverPhoto !== undefined) updateData.coverPhoto = coverPhoto;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ status: true, user, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is required" });
    }

    const user = await User.findById(id).select(
      "name email phone address createdAt profilePhoto coverPhoto"
    );

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({ status: true, user });
  } catch (err) {
    console.error("Get User By ID Error:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user?.id;

    if (!query || query.trim() === "") {
      return res.json({ status: true, users: [] });
    }

    const searchRegex = new RegExp(query.trim(), "i");
    const users = await User.find({
      $and: [
        {
          $or: [{ name: searchRegex }, { email: searchRegex }],
        },
        { _id: { $ne: currentUserId } },
      ],
    })
      .select("name email profilePhoto coverPhoto createdAt")
      .limit(50);

    res.json({ status: true, users });
  } catch (err) {
    console.error("Search Users Error:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name email role phone address createdAt profilePhoto coverPhoto"
    );
    res.json({ status: true, users });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || name.length < 3)
      return res
        .status(400)
        .json({ status: false, message: "Name must be at least 3 characters" });

    if (role && role !== "user") {
      return res.status(403).json({
        status: false,
        message: "Role update not allowed. Only 'user' role is permitted.",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });

    user.name = name;
    user.role = "user";

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
  getUserProfile,
  updateUserProfile,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  searchUsers,
};
