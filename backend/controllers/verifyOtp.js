const crypto = require("crypto");
const User = require("../models/user");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const findedUser = await User.findOne({
      email,
      "otp.otp": otp.toString(),
    });

    if (!findedUser) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const expiryTime =
      new Date(findedUser.otp.sendTime).getTime() + 5 * 60 * 1000;
    if (Date.now() > expiryTime) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    findedUser.otp.otp = null;
    const resetToken = crypto.randomBytes(20).toString("hex");
    findedUser.otp.token = resetToken;
    findedUser.otp.sendTime = new Date();
    await findedUser.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      status: true,
      token: resetToken,
      email: email,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = verifyOtp;
