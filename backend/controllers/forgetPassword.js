const User = require("../models/user");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const findedUser = await User.findOne({ email });
    if (!findedUser) {
      return res.status(404).json({ message: "No user found" });
    }

    if (findedUser.otp && findedUser.otp.sendTime > Date.now()) {
      return res.status(400).json({
        message: `Please wait until ${new Date(
          findedUser.otp.sendTime
        ).toLocaleTimeString()}`,
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("Generated OTP:", otp);

    findedUser.otp = {
      otp: otp,
      sendTime: Date.now() + 1 * 60 * 1000,
      token: crypto.randomBytes(32).toString("hex"),
    };

    await findedUser.save();

    await sendMail(otp, email);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forget Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = forgetPassword;
