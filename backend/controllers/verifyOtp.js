const User = require("../models/user");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required", status: false });
    }

    const formattedEmail = email.toLowerCase();
    const user = await User.findOne({ email: formattedEmail });
    
    if (!user || !user.resetPassword) {
      return res
        .status(400)
        .json({ message: "Invalid request. Please request OTP again.", status: false });
    }

    if (!user.resetPassword.otpExpiry || user.resetPassword.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired. Please request a new OTP.", status: false });
    }

    if (user.resetPassword.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP", status: false });
    }

    res.status(200).json({
      message: "OTP verified",
      status: true,
      token: user.resetPassword.token,
      email: user.email,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: error.message, status: false });
  }
};

module.exports = verifyOtp;
