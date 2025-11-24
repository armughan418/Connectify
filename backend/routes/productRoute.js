const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");

const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controllers/productController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addProduct
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateProduct
);

router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

router.post("/:id/review", authMiddleware, addReview);

module.exports = router;
