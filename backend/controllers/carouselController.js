const CarouselImage = require("../models/carouselImage");
const streamUpload = require("../utils/cloudinaryUpload");

const getCarousel = async (req, res) => {
  try {
    const images = await CarouselImage.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addCarouselImage = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Image file required" });

    const uploaded = await streamUpload(req.file.buffer);

    const img = await CarouselImage.create({
      image: uploaded.secure_url,
      alt: req.body.alt || "",
      title: req.body.title || "",
      order: Number(req.body.order) || 0,
    });

    res.status(201).json({ success: true, image: img });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCarouselImage = async (req, res) => {
  try {
    const id = req.params.id;
    const image = await CarouselImage.findById(id);
    if (!image)
      return res.status(404).json({ success: false, message: "Not found" });

    if (req.file) {
      const uploaded = await streamUpload(req.file.buffer);
      image.image = uploaded.secure_url;
    }

    if (req.body.alt !== undefined) image.alt = req.body.alt;
    if (req.body.title !== undefined) image.title = req.body.title;
    if (req.body.order !== undefined) image.order = Number(req.body.order);

    await image.save();
    res.json({ success: true, image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCarouselImage = async (req, res) => {
  try {
    const id = req.params.id;
    await CarouselImage.findByIdAndDelete(id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCarousel,
  addCarouselImage,
  updateCarouselImage,
  deleteCarouselImage,
};
