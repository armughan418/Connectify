const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const formattedEmail = email.toLowerCase();
    const findedUser = await User.findOne({ email: formattedEmail });

    if (!findedUser) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      findedUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Password" });
    }

    const accessToken = jwt.sign(
      { email: formattedEmail, userId: findedUser._id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      status: true,
      message: "Login Successful",
      token: accessToken,
      user: { id: findedUser._id, email: findedUser.email },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
