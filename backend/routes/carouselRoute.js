const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const {
  getCarousel,
  addCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
} = require("../controllers/carouselController");

router.get("/", getCarousel);

router.post("/add", auth, admin, upload.single("image"), addCarouselImage);

router.put(
  "/update/:id",
  auth,
  admin,
  upload.single("image"),
  updateCarouselImage
);

router.delete("/delete/:id", auth, admin, deleteCarouselImage);

module.exports = router;
