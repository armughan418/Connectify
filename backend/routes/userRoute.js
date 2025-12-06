const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuth");

const { register } = require("../controllers/register");
const login = require("../controllers/login");
const forgetPassword = require("../controllers/forgetPassword");
const verifyOtp = require("../controllers/verifyOtp");
const updatePassword = require("../controllers/updatePassword");
const getAccess = require("../controllers/getAcess");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userControllers");

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/forget/password", forgetPassword);
router.post("/otp/verify", verifyOtp);
router.patch("/update/password", updatePassword);
router.get("/get/access", getAccess);

// Profile routes (protected)
router.get("/profile", userAuth, getUserProfile);
router.put("/profile", userAuth, updateUserProfile);

module.exports = router;
