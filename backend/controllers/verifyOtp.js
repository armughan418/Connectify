const User = require("../models/user");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const formattedEmail = email.toLowerCase();
    const user = await User.findOne({ email: formattedEmail });
    if (!user || !user.otp)
      return res
        .status(400)
        .json({ message: "Invalid request", status: false });

    if (user.otp.tokenExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired", status: false });
    }

    if (user.otp.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP", status: false });
    }

    res.status(200).json({
      message: "OTP verified",
      status: true,
      token: user.otp.token,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

module.exports = verifyOtp;
