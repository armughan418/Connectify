const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

// admin stats
router.get("/stats", adminAuth, getAdminStats);

// user management
router.get("/users", adminAuth, getAllUsers);
router.put("/users/:id", adminAuth, updateUser);
router.delete("/users/:id", adminAuth, deleteUser);

module.exports = router;
