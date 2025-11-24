// resetPassword.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const UpdatePassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const formattedEmail = email.toLowerCase();
    const user = await User.findOne({ email: formattedEmail });
    if (!user || !user.otp)
      return res
        .status(400)
        .json({ message: "Invalid request", status: false });
    if (user.otp.token !== token)
      return res
        .status(400)
        .json({ message: "Invalid or expired token", status: false });

    // Set plain password - pre-save hook will hash it automatically
    user.password = password;
    // Clear OTP after successful password reset
    user.otp = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

module.exports = UpdatePassword;
