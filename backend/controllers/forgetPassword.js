const User = require("../models/user");
const crypto = require("crypto");
const sendOtpEmail = require("../utils/otpMail");

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found with this email",
      });
    }

    if (
      user.resetPassword &&
      user.resetPassword.otpSendTime &&
      Date.now() - user.resetPassword.otpSendTime < 60 * 1000
    ) {
      return res.status(429).json({
        status: false,
        message: "Wait 1 minute before requesting another OTP",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPassword = {
      otp,
      otpSendTime: Date.now(),
      token: resetToken,
      otpExpiry: Date.now() + 3 * 60 * 1000,
    };

    await user.save();

    const mailSent = await sendOtpEmail(otp, user.email);

    if (!mailSent) {
      return res.status(500).json({
        status: false,
        message: "Failed to send OTP email",
      });
    }

    res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      token: resetToken,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).json({
      status: false,
      message: "Server error while sending OTP",
    });
  }
};

module.exports = forgetPassword;
