const User = require("../models/user");
const crypto = require("crypto");
const sendOtpEmail = require("../utils/otpMail");

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "User not found with this email",
        status: false,
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const sendTime = Date.now();
    const resetToken = crypto.randomBytes(20).toString("hex");
    const tokenExpiry = sendTime + 1 * 60 * 1000;

    user.otp = { otp, sendTime, token: resetToken, tokenExpiry };
    await user.save();

    const mailSent = await sendOtpEmail(otp, user.email);

    if (!mailSent) {
      return res.status(500).json({
        message: "Failed to send OTP email",
        status: false,
      });
    }

    res.status(200).json({
      message: "OTP sent successfully to your email",
      status: true,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).json({
      message: "Server error while sending OTP",
      status: false,
    });
  }
};

module.exports = forgetPassword;
