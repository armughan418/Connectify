const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.json({ status: true, users });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role },
      { new: true }
    );
    res.json({ status: true, user, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
