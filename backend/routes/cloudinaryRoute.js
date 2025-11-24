const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.get("/signature", (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "products";

  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    process.env.CLOUD_API_SECRET
  );

  res.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUD_API_KEY,
    folder,
    cloudName: process.env.CLOUD_NAME,
  });
});

module.exports = router;
