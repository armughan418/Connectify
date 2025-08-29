const express = require("express");
const { register } = require("../controllers/register");
const router = express.Router();
const login = require("../controllers/login");
const forgetPassword = require("../controllers/forgetPassword");
const verifyOtp = require("../controllers/verifyOtp");
const updatePassword = require("../controllers/updatePassword");
const getAcess = require("../controllers/getAcess");

router.post("/register", register);
router.post("/login", login);
router.post("/forget/password", forgetPassword);
router.post("/otp/verify", verifyOtp);
router.patch("/update/password", updatePassword);
router.get("/get/access", getAcess);

module.exports = router;
