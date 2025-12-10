const User = require("../models/user");

const updatePassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    if (!email || !token || !password)
      return res.status(400).json({
        message: "Email, token and new password are required",
        status: false,
      });

    const formattedEmail = email.toLowerCase();

    const user = await User.findOne({ email: formattedEmail });

    if (!user || !user.resetPassword)
      return res
        .status(400)
        .json({ message: "Invalid request", status: false });

    const resetData = user.resetPassword;

    if (!resetData.token || resetData.token !== token)
      return res
        .status(400)
        .json({ message: "Invalid or expired token", status: false });

    if (resetData.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired", status: false });

    user.password = password;

    user.resetPassword = undefined;

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

module.exports = updatePassword;
