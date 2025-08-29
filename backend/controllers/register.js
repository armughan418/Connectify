const User = require("../models/user");
const bcrypt = require("bcryptjs");
const joi = require("joi");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { error: validationError } = validateUser(req.body);

  try {
    if (validationError) {
      return res
        .status(400)
        .json({ message: validationError.details[0].message });
    }

    const formatName = name.toLowerCase();
    const formatEmail = email.toLowerCase();

    const findedUser = await User.findOne({ email: formatEmail });
    if (findedUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: formatName,
      email: formatEmail,
      password: hashedPassword,
    });

    const saveUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: saveUser,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function validateUser(data) {
  const userSchema = joi.object({
    name: joi.string().min(3).max(16).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(12).required(),
  });
  return userSchema.validate(data);
}

module.exports = { register };
