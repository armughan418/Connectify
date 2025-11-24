const express = require("express");
const { register } = require("../controllers/register");
const login = require("../controllers/login");
const forgetPassword = require("../controllers/forgetPassword");
const verifyOtp = require("../controllers/verifyOtp");
const updatePassword = require("../controllers/updatePassword");
const getAcess = require("../controllers/getAcess");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const userController = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forget/password", forgetPassword);
router.post("/otp/verify", verifyOtp);
router.patch("/update/password", updatePassword);
router.get("/get/access", getAcess);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const User = require("../models/user");
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.json({ status: true, user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const User = require("../models/user");
    const { name, email, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ status: true, user, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

router.post(
  "/admin/add-product",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({ message: "Product added successfully by admin" });
  }
);

router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);
router.put("/:id", authMiddleware, adminMiddleware, userController.updateUser);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

module.exports = router;
