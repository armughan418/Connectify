const mongoose = require("mongoose");

const carouselImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    alt: { type: String },
    order: { type: Number, default: 0 },
    title: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarouselImage", carouselImageSchema);
