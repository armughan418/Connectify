const User = require("../models/user");
const bcrypt = require("bcrypt");

const updatePassword = async (req, res) => {
  const { password, confirmPassword, token } = req.body;

  try {
    console.log("Incoming Data => ", { password, confirmPassword, token });

    // user find with token
    const findedUser = await User.findOne({ "otp.token": token });
    console.log("Finded User => ", findedUser);

    if (!findedUser) {
      return res.status(400).json({
        message: "Invalid or expired token. Please try again.",
        status: false,
      });
    }

    // Token expiry check (5 minutes)
    if (
      new Date(findedUser.otp.sendTime).getTime() + 5 * 60 * 1000 <
      Date.now()
    ) {
      return res.status(400).json({
        message: "Token Expired",
        status: false,
      });
    }

    // password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and Confirm Password must be same",
        status: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    findedUser.password = hashedPassword;

    // clear otp fields
    findedUser.otp.sendTime = null;
    findedUser.otp.token = null;

    await findedUser.save();

    return res.status(200).json({
      message: "Password Updated Successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error occurred while updating Password: ", error);
    return res.status(500).json({
      message: "Server Error while updating password",
      status: false,
    });
  }
};

module.exports = updatePassword;
