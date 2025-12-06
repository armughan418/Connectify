const User = require("../models/user");
const joi = require("joi");

const register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  const { error } = validateUser(req.body);
  if (error)
    return res
      .status(400)
      .json({ message: error.details[0].message, status: false });

  try {
    const formattedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: formattedEmail });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({
      name,
      email: formattedEmail,
      password,
      phone,
      address,
      role: "user",
    });

    await user.save();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
      status: true,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ 
      message: error.message || "Internal server error",
      status: false 
    });
  }
};

function validateUser(data) {
  return joi
    .object({
      name: joi.string().min(3).max(16).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).max(12).required(),
      phone: joi.string().required(),
      address: joi.string().required(),
    })
    .validate(data);
}

module.exports = { register };
